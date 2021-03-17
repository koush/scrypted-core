import { ScryptedStatic } from "@scrypted/sdk/types";
import { SocketOptions } from 'engine.io-client';
import eio from 'engine.io-client';
import { attachPluginRemote } from '../../../node-scrypted/src/plugin/plugin-remote';
import { RpcPeer } from '../../../node-scrypted/src/rpc';

export interface ScryptedClientStatic extends ScryptedStatic {
    disconnect(): void;
    rpc(target: string, method: string, args: any[]): Promise<any>;
    onClose?: Function;
    userStorage: Storage,
}

export default {
    connect(baseUrl: string): Promise<ScryptedClientStatic> {
        const rootLocation = baseUrl || `${window.location.protocol}//${window.location.host}`;
        const endpointPath = `/endpoint/@scrypted/core`;
        const endpointUrl = `${rootLocation}${endpointPath}`;
        const apiUrl = `${endpointUrl}/api`;

        return new Promise((resolve, reject) => {

            const options: SocketOptions = {
                path: `${endpointPath}/engine.io/`,
            };
            const socket = eio(rootLocation, options);

            socket.on('open', async function () {
                try {
                    const rpcPeer = new RpcPeer(message => socket.send(JSON.stringify(message)));
                    socket.on('message', data => rpcPeer.handleMessage(JSON.parse(data as string)));
                    
                    const scrypted = await attachPluginRemote(rpcPeer);
                    const {
                        systemManager,
                        deviceManager,
                        endpointManager,
                        mediaManager,
                    } = scrypted;

                    const userStorage = await rpcPeer.eval('return userStorage');

                    const ret: ScryptedClientStatic = {
                        systemManager,
                        deviceManager,
                        endpointManager,
                        mediaManager,
                        userStorage,
                        async rpc(target: string, method: string, args: any[]) {
                            return [];
                        },
                        disconnect() {
                            socket.close();
                        }
                    }

                    resolve(ret);
                }
                catch (e) {
                    socket.close();
                    reject(e);
                }
            })
        });
    }
}
