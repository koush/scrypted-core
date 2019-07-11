// https://developer.scrypted.app/#getting-started
// package.json contains the metadata (name, interfaces) about this device
// under the "scrypted" key.
import { ScryptedDeviceBase, HttpRequestHandler, HttpRequest, HttpResponse, EngineIOHandler, EventDetails, ScryptedDevice, EventListenerRegister } from '@scrypted/sdk';
import sdk from '@scrypted/sdk';
const { systemManager, mediaManager, endpointManager } = sdk;
import Router from 'router';
import Url from 'url-parse';
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
    webSocket: WebSocket;
    listeners = new Map<String, EventListenerRegister>();
}

class ScryptedUI extends ScryptedDeviceBase implements HttpRequestHandler, EngineIOHandler {
    router = Router();

    constructor() {
        super();

        this.router.get('/api/devices', this.handleDevices.bind(this));
        this.router.get('/api/state', this.handleState.bind(this));
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

        const session = new WebSocketSession();
        session.webSocket = ws;

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            this.handleIncomingMessage(data, session);
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

    getAlerts(session: WebSocketSession, resultId: string) {
        var alerts = toArray(__manager.getStore().boxFor("com.koushikdutta.scrypted.ScryptedAlert").getAll())
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
        this.sendOutgoingMessage({
            type: 'rpc',
            resultId,
            result: alerts,
        }, session.webSocket);
    }

    removeAlerts(session: WebSocketSession, resultId: string, ids: Array<string>) {
        if (!ids) {
            __manager.getStore().boxFor("com.koushikdutta.scrypted.ScryptedAlert").removeAll();
        }
        else {
            for (var id of ids) {
                __manager.getStore().boxFor("com.koushikdutta.scrypted.ScryptedAlert").remove(id);
            }
        }
        this.sendOutgoingMessage({
            type: 'rpc',
            resultId,
            result: undefined,
        }, session.webSocket);
    }

    handleIncomingMessage(message: any, session: WebSocketSession) {
        switch (message.type) {
            case 'rpc': {
                const { method, resultId, args } = message;
                try {
                    switch (method) {
                        case 'alerts': {
                            this.getAlerts(session, resultId);
                            return;
                        }
                        case 'removeAlerts': {
                            this.removeAlerts(session, resultId, args[0] as Array<string>);
                            return;
                        }
                    }
                    throw new Error('rpc not found');
                }
                catch (e) {
                    this.sendOutgoingMessage({
                        type: 'rpc',
                        resultId,
                        error: e.toString(),
                    }, session.webSocket);
                }
                break;
            }
            case 'listen': {
                const { id, listenerId, options } = message;
                const register = systemManager.getDeviceById(id).listen(options, (eventSource, eventDetails, eventData) => {
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
                const { id, method, argArray } = message;
                const device = systemManager.getDeviceById(id);
                device[method](...argArray);
                break;
            }
            case 'system': {
                const { method, argArray, resultId } = message;
                systemManager[method](...argArray || [])
                    .then(result => {
                        this.sendOutgoingMessage({
                            type: 'system',
                            resultId,
                            result: Buffer.isBuffer(result) ? new Buffer(result).toString('base64') : result,
                        }, session.webSocket);
                    })
                    .catch(e => {
                        this.sendOutgoingMessage({
                            type: 'system',
                            resultId,
                            error: e.toString(),
                        }, session.webSocket);
                    })
                break;
            }
            case 'media': {
                const { method, toMimeType, mediaSource, resultId } = message;
                const { id, method: sourceMethod } = mediaSource;
                const device = systemManager.getDeviceById(id);
                const mediaObject = device[sourceMethod]();

                mediaManager[method](mediaObject, toMimeType)
                    .then(result => {
                        this.sendOutgoingMessage({
                            type: 'media',
                            resultId,
                            result: Buffer.isBuffer(result) ? new Buffer(result).toString('base64') : result,
                        }, session.webSocket);
                    })
                    .catch(e => {
                        this.sendOutgoingMessage({
                            type: 'media',
                            resultId,
                            error: e.toString(),
                        }, session.webSocket);
                    })
                break;
            }
        }
    }

    handleState(httpRequest: HttpRequest, response: HttpResponse) {
        this.sendJson(response, systemManager.getSystemState());
    }

    handleFinal(request: HttpRequest, response: HttpResponse) {
        // the web app static files are only served on the public endpoint.
        if (!request.isPublicEndpoint) {
            response.send({
                code: 404,
            }, 'Not Found');
            return;
        }

        // need to strip off the query.
        const incomingUrl = new Url(request.url);
        if (request.url !== '/index.html') {
            response.sendFile("dist" + incomingUrl.pathname);
            return;
        }
        
        // the rel hrefs (manifest, icons) are pulled out of process. need to attach
        // auth info to them.
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

        this.router(normalizedRequest, response, () => this.handleFinal(normalizedRequest, response));
    }

    handleDevices(httpRequest: HttpRequest, response: HttpResponse) {
        var devices = toArray(__manager.getAllThings());
        this.sendJson(response, devices.map(device => {
            const owner = device.owner;
            return {
                id: device.refId,
                icon: device.icon,
                type: device.type.toString(),
                name: device.name,
                owner: owner ? {
                    id: owner.id,
                    name: owner.name,
                } : null,
                component: device.component ? {
                    id: device.component.id,
                    name: device.component.name,
                } : null,
            }
        }));
    }
}

export default new ScryptedUI();
