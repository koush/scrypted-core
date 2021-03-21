// https://developer.scrypted.app/#getting-started
// package.json contains the metadata (name, interfaces) about this device
// under the "scrypted" key.
import { ScryptedDeviceBase, HttpRequestHandler, HttpRequest, HttpResponse, EngineIOHandler, EventDetails, ScryptedDevice, EventListenerRegister, Device, DeviceManifest, EventListenerOptions, ScryptedInterfaceProperty, BufferConverter, ScryptedMimeTypes, DeviceProvider, ScryptedDeviceType, ScryptedInterface } from '@scrypted/sdk';
import sdk from '@scrypted/sdk';
const { systemManager, deviceManager, mediaManager, endpointManager } = sdk;
import Router from 'router';
import Url from 'url-parse';
import { UserStorage } from './userStorage';
import { RpcPeer } from '../../../../node-scrypted/src/rpc';
import { setupPluginRemote } from '../../../../node-scrypted/src/plugin/plugin-remote';
import { PluginAPI } from '../../../../node-scrypted/src/plugin/plugin-api';
import { Logger } from '../../../../node-scrypted/src/logger';
import { UrlConverter } from './converters';
import process from 'process';
const indexHtml: string = require('raw-loader!../fs/dist/index.html');

class ScryptedUI extends ScryptedDeviceBase implements HttpRequestHandler, EngineIOHandler, DeviceProvider {
    router = Router();
    publicRouter = Router();
    httpHost: UrlConverter;
    httpsHost: UrlConverter;

    constructor() {
        super();

        deviceManager.onDevicesChanged({
            devices: [
                {
                    name: 'HTTP file host',
                    nativeId: 'http',
                    interfaces: [ScryptedInterface.BufferConverter, ScryptedInterface.HttpRequestHandler],
                },
                {
                    name: 'HTTPS file host',
                    nativeId: 'https',
                    interfaces: [ScryptedInterface.BufferConverter, ScryptedInterface.HttpRequestHandler],
                }
            ]
        })
        .then(() => {
            this.httpHost = new UrlConverter(false);
            this.httpsHost = new UrlConverter(true);
        })
    }

    getDevice(nativeId: string) {
        if (nativeId === 'http')
            return this.httpHost;
        if (nativeId === 'https')
            return this.httpsHost;
    }

    discoverDevices(duration: number): void {
        throw new Error('Method not implemented.');
    }

    getEndpoint(): string {
        return '@scrypted/core';
    }

    sendJson(response: HttpResponse, data: object) {
        response.send(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    async onConnection(request: HttpRequest, webSocketUrl: string): Promise<void> {
        const ws = new WebSocket(webSocketUrl);

        if (request.isPublicEndpoint) {
            ws.close();
            return;
        }

        const peer = new RpcPeer(message => ws.send(JSON.stringify(message)));
        ws.onmessage = message => peer.handleMessage(JSON.parse(message.data));
        const userStorage = new UserStorage(request.username);
        peer.params.userStorage = userStorage;

        class PluginAPIImpl implements PluginAPI {
            getLogger(nativeId: string): Promise<Logger> {
                throw new Error('Method not implemented.');
            }
            getComponent(id: string): Promise<any> {
                return systemManager.getComponent(id);
            }
            async setDeviceProperty(id: string, property: ScryptedInterfaceProperty, value: any): Promise<void> {
                const device = await this.getDeviceById(id);
                if (property === ScryptedInterfaceProperty.name)
                    device.setName(value);
                else if (property === ScryptedInterfaceProperty.type)
                    device.setType(value);
                else if (property === ScryptedInterfaceProperty.room)
                    device.setRoom(value);
                else
                    throw new Error(`Not allowed to set property ${property}`);
            }
            async setState(nativeId: string, key: string, value: any) {
                throw new Error('Method not implemented.');
            }
            async onDevicesChanged(deviceManifest: DeviceManifest) {
                throw new Error('Method not implemented.');
            }
            async onDeviceDiscovered(device: Device) {
                throw new Error('Method not implemented.');
            }
            async onDeviceEvent(nativeId: string, eventInterface: any, eventData?: any) {
                throw new Error('Method not implemented.');
            }
            async onDeviceRemoved(nativeId: String) {
                throw new Error('Method not implemented.');
            }
            setStorage(nativeId: string, storage: { [key: string]: any; }): void {
                throw new Error('Method not implemented.');
            }
            async getDeviceById(id: string): Promise<ScryptedDevice> {
                return systemManager.getDeviceById(id);
            }
            async listen(EventListener: (id: string, eventDetails: EventDetails, eventData: object) => void): Promise<EventListenerRegister> {
                return systemManager.listen((eventSource, eventDetails, eventData) => EventListener(eventSource?.id, eventDetails, eventData));
            }
            async listenDevice(id: string, event: string | EventListenerOptions, callback: (eventDetails: EventDetails, eventData: object) => void): Promise<EventListenerRegister> {
                return systemManager.listenDevice(id, event, (eventSource, eventDetails, eventData) => callback(eventDetails, eventData));
            }
            ioClose(id: string): void {
                throw new Error('Method not implemented.');
            }
            ioSend(id: string, message: string): void {
                throw new Error('Method not implemented.');
            }
            async removeDevice(id: string) {
                systemManager.removeDevice(id);
            }
            kill() {
            }
        }
        const api = new PluginAPIImpl();

        const remote = await setupPluginRemote(peer, api, null);
        await remote.setSystemState(systemManager.getSystemState());


        // this listener keeps the system state up to date on the other end.
        systemManager.listen((eventSource: ScryptedDevice | null, eventDetails: EventDetails, eventData: any) => {
            if (eventSource) {
                remote.updateState(eventSource.id, systemManager.getDeviceState(eventSource.id));
            }
            else {
                if (eventDetails.property === ScryptedInterfaceProperty.id && eventData != null)
                    remote.updateState(eventData as ScryptedInterfaceProperty, undefined);
                else
                    console.warn('unknown event source', eventData);
            }
        });

        ws.onclose = () => {
            api.kill();
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
                response.send(rewritten, {
                    headers: {
                        'Content-Type': 'text/html',
                    }
                });
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
                response.send('Not Found', {
                    code: 404,
                });
            });
        }
    }
}

export default new ScryptedUI();
