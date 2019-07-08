// https://developer.scrypted.app/#getting-started
// package.json contains the metadata (name, interfaces) about this device
// under the "scrypted" key.
import { ScryptedDeviceBase, HttpRequestHandler, HttpRequest, HttpResponse, EngineIOHandler, EventDetails, ScryptedDevice, EventListenerRegister } from '@scrypted/sdk';
import sdk from '@scrypted/sdk';
const { systemManager, mediaManager } = sdk;
import Router from 'router';

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
        return '@scrypted/ui';
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

    handleIncomingMessage(message: any, session: WebSocketSession) {
        switch (message.type) {
            case 'rpc': {
                const { method, resultId } = message;
                switch (method) {
                    case 'alerts': {
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
                        break;
                    }
                }
                this.sendOutgoingMessage({
                    type: 'rpc',
                    resultId,
                    error: 'no rpc',
                }, session.webSocket);
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
        response.sendFile("dist" + request.url);
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
