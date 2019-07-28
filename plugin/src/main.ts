// https://developer.scrypted.app/#getting-started
// package.json contains the metadata (name, interfaces) about this device
// under the "scrypted" key.
import { ScryptedDeviceBase, HttpRequestHandler, HttpRequest, HttpResponse, EngineIOHandler, EventDetails, ScryptedDevice, EventListenerRegister } from '@scrypted/sdk';
import sdk from '@scrypted/sdk';
const { systemManager, deviceManager, mediaManager, endpointManager, zwaveManager } = sdk;
import Router from 'router';
import Url from 'url-parse';
import { UserStorage } from './userStorage';
const indexHtml: string = require('raw-loader!../fs/dist/index.html');

function toArray(arrayLike: any): object[] {
    const size = arrayLike.size ? arrayLike.size() : arrayLike.length;
    var ret = [];
    for (var i = 0; i < size; i++) {
        ret.push(arrayLike[i]);
    }
    return ret;
}

class WebSocketSession {
    userStorage: Storage;
    rpcTargets: any;
    webSocket: WebSocket;
    listeners = new Map<String, EventListenerRegister>();
}

class ScryptedUI extends ScryptedDeviceBase implements HttpRequestHandler, EngineIOHandler {
    router = Router();
    publicRouter = Router();

    constructor() {
        super();
    }

    getEndpoint(): string {
        return '@scrypted/core';
    }

    sendJson(response: HttpResponse, data: object) {
        response.send({
            headers: {
                'Content-Type': 'application/json',
            }
        }, JSON.stringify(data))
    }

    onConnection(request: HttpRequest, webSocketUrl: string): void {
        const ws = new WebSocket(webSocketUrl);
        if (request.isPublicEndpoint) {
            ws.close();
            return;
        }

        const userStorage = new UserStorage(request.username);
        const session = new WebSocketSession();
        session.webSocket = ws;
        session.rpcTargets = {
            this: this,
            userStorage,
            systemManager,
            deviceManager,
            mediaManager,
            endpointManager,
            zwaveManager,
            localStorage,
        };
    
        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            try {
                this.handleIncomingMessage(data, session);
            }
            catch (e) {
                this.log.e(`error handling message ${e}`);
                this.log.e(message.data);
            }
        }

        ws.onclose = () => {
            console.log('Closing session.');
            session.listeners.forEach(l => l.removeListener())
        };

        // this listener keeps the system state up to date on the other end.
        const systemListener = systemManager.listen((eventSource: ScryptedDevice | null, eventDetails: EventDetails, eventData: object) => {
            ws.send(JSON.stringify({
                type: "sync",
                id: eventSource.id,
                eventDetails,
                eventData,
            }));
        });
        session.listeners.set('system', systemListener);
    }

    sendOutgoingMessage(message: any, webSocket: WebSocket) {
        webSocket.send(JSON.stringify(message));
    }

    getAlerts() {
        return toArray(__manager.getStore().boxFor("com.koushikdutta.scrypted.ScryptedAlert").getAll())
            .map((alert: any) => {
                const {
                    id,
                    title,
                    message,
                    timestamp,
                    path,
                    icon,
                } = alert;

                return {
                    id,
                    title,
                    message,
                    timestamp,
                    path,
                    icon,
                };
            });
    }

    removeAlerts(ids: string[]) {
        if (!ids || !ids.length) {
            __manager.getStore().boxFor("com.koushikdutta.scrypted.ScryptedAlert").removeAll();
        }
        else {
            for (var id of ids) {
                __manager.getStore().boxFor("com.koushikdutta.scrypted.ScryptedAlert").remove(id);
            }
        }
    }

    returnResult(session: WebSocketSession, resultId: string, result: any) {
        this.sendOutgoingMessage({
            type: 'rpc',
            resultId,
            result: Buffer.isBuffer(result) ? new Buffer(result).toString('base64') : result,
        }, session.webSocket);
    }

    returnError(session: WebSocketSession, resultId: string, e: any) {
        this.sendOutgoingMessage({
            type: 'rpc',
            resultId,
            error: e.toString(),
        }, session.webSocket);
    }

    doRpc(session: WebSocketSession, resultId, target, method, args) {
        try {
            // console.log(target, method);
            var value = args ? target[method](...args) : target[method];
            var promise;
            if (value && value.then && value.catch) {
                promise = value;
            }
            else {
                promise = Promise.resolve(value);
            }
            promise
            .then(result => this.returnResult(session, resultId, result))
            .catch(e => this.returnError(session, resultId, e));
        }
        catch (e) {
            this.returnError(session, resultId, e);
        }
    }

    // legacy shim
    listenDevice(id, options, callback) {
        if (systemManager.listenDevice) {
            return systemManager.listenDevice(id, options, callback);
        }
        return systemManager.getDeviceById(id).listen(options, callback);
    }

    handleIncomingMessage(message: any, session: WebSocketSession) {
        switch (message.type) {
            case 'rpc': {
                const { target, method, resultId, args } = message;
                this.doRpc(session, resultId, session.rpcTargets[target], method, args);
                break;
            }
            case 'listen': {
                const { id, listenerId, options } = message;
                const register = this.listenDevice(id, options, (eventSource, eventDetails, eventData) => {
                    this.sendOutgoingMessage({
                        type: 'listenEvent',
                        listenerId,
                        id: eventSource.id,
                        eventDetails,
                        eventData,
                    }, session.webSocket);
                });
                const existing = session.listeners.get(listenerId);
                session.listeners.set(listenerId, register);
                if (existing) {
                    existing.removeListener();
                }
                break;
            }
            case 'systemListen': {

            }
            case 'removeListener': {
                let { listenerId } = message;
                const existing = session.listeners.get(listenerId);
                session.listeners.delete(listenerId);
                if (existing) {
                    existing.removeListener();
                }
                break;
            }
            case 'method': {
                const { id, method, argArray, resultId } = message;
                const device = systemManager.getDeviceById(id);
                try {
                    this.returnResult(session, resultId, device[method](...argArray));
                }
                catch (e) {
                    this.returnError(session, resultId, e);
                }
                break;
            }
            case 'system': {
                // legacy
                const { method, argArray, resultId } = message;
                this.doRpc(session, resultId, systemManager, method, argArray || []);
                break;
            }
            case 'media': {
                // shimming is necessary because the media object itself needs to be
                // proxied.
                const { method, toMimeType, mediaSource, resultId } = message;
                const { id, method: sourceMethod } = mediaSource;
                const device = systemManager.getDeviceById(id);
                const mediaObject = device[sourceMethod]();

                this.doRpc(session, resultId, mediaManager, method, [mediaObject, toMimeType]);
                break;
            }
        }
    }

    handlePublicFinal(request: HttpRequest, response: HttpResponse) {
        // need to strip off the query.
        const incomingUrl = new Url(request.url);
        if (request.url !== '/index.html') {
            response.sendFile("dist" + incomingUrl.pathname);
            return;
        }

        // the rel hrefs (manifest, icons) are pulled in a web worker which does not
        // have cookies. need to attach auth info to them.
        endpointManager.getPublicCloudEndpoint()
            .then(endpoint => {
                const u = new Url(endpoint);
                const rewritten = indexHtml
                    .replace('href=/endpoint/@scrypted/core/public/manifest.json', `href="/endpoint/@scrypted/core/public/manifest.json${u.query}"`)
                    .replace('href=/endpoint/@scrypted/core/public/img/icons/apple-touch-icon-152x152.png', `href="/endpoint/@scrypted/core/public/img/icons/apple-touch-icon-152x152.png${u.query}"`)
                    .replace('href=/endpoint/@scrypted/core/public/img/icons/safari-pinned-tab.svg', `href="/endpoint/@scrypted/core/public/img/icons/safari-pinned-tab.svg${u.query}"`)
                    ;
                response.send({
                    headers: {
                        'Content-Type': 'text/html',
                    }
                }, rewritten);
            })
            .catch(() => {
                response.sendFile("dist" + incomingUrl.pathname);
            });
    }

    onRequest(request: HttpRequest, response: HttpResponse) {
        const normalizedRequest = Object.assign({}, request);
        normalizedRequest.url = normalizedRequest.url.replace(normalizedRequest.rootPath, '');
        if (normalizedRequest.url == '/') {
            normalizedRequest.url = '/index.html';
        }

        if (request.isPublicEndpoint) {
            this.publicRouter(normalizedRequest, response, () => this.handlePublicFinal(normalizedRequest, response));
        }
        else {
            this.router(normalizedRequest, response, () => {
                response.send({
                    code: 404,
                }, 'Not Found');
            });
        }
    }
}

export default new ScryptedUI();
