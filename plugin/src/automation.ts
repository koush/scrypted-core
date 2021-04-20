import { EventDetails, EventListenerRegister, OnOff, ScryptedDevice, ScryptedDeviceBase } from "@scrypted/sdk";
import sdk from "@scrypted/sdk";
import { Javascript } from "./builtins/javascript";
const { systemManager } = sdk;

export class Automation extends ScryptedDeviceBase implements OnOff {
    registers: EventListenerRegister[] = [];

    constructor(nativeId: string) {
        super(nativeId);

        this.bind();

        this.on = this.storage.getItem('enabled') !== 'false';
    }

    async turnOff() {
        this.storage.setItem('enabled', 'false');
        this.on = false;
    }

    async turnOn() {
        this.storage.removeItem('enabled');
        this.on = true;
    }

    bind() {
        for (const register of this.registers) {
            register.removeListener();
        }
        this.registers = [];

        try {
            const data = JSON.parse(this.storage.getItem('data'));

            const runActions = (eventSource: ScryptedDevice, eventDetails: EventDetails, eventData: any) => {
                for (const action of data.actions) {
                    const parts = action.id.split('#');
                    const id = parts[0];

                    let device: any;
                    if (id === 'javascript') {
                        device = new Javascript(systemManager, eventSource, eventDetails, eventData);
                    }
                    else {
                        device = systemManager.getDeviceById(id);
                    }

                    const { rpc } = action.model;
                    device[rpc.method](...rpc.parameters || []);
                }
            }

            for (const trigger of data.triggers) {
                const parts = trigger.id.split('#');
                const id = parts[0];
                const denoise = data.denoiseEvents;
                const { condition } = trigger;
                const event = parts[1];
                const device = systemManager.getDeviceById(id);
                const register = device.listen({
                    denoise,
                    event,
                }, (eventSource, eventDetails, eventData) => {
                    this.log.i(`automation triggered by ${eventSource.name}`);

                    if (condition) {
                        const f = eval(`(function(eventSource, eventDetails, eventData) {
                            return ${condition};
                        })`);

                        if (!f(eventSource, eventDetails, eventData)) {
                            this.log.i('condition check false, not starting automation');
                            return;
                        }
                    }

                    console.log('starting automation');
                    runActions(eventSource, eventDetails, eventData);
                });

                this.registers.push(register);
            }
        }
        catch (e) {
            console.error('automation load error', e);
        }
    }
}
