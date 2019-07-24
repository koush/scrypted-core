import { SystemManager, ScryptedDeviceType, ScryptedDevice, ScryptedInterface } from "@scrypted/sdk";
import DashboardMap from "./DashboardMap.vue";
import DashboardToggle from "./DashboardToggle.vue";
import DashboardCamera from "./DashboardCamera.vue";
import DashboardLock from "./DashboardLock.vue";
import DashboardThermostat from "./DashboardThermostat.vue";
import { Multimap } from "./multimap";

export interface Card {
    height: number;
    name: string;
    components: CardComponent[];
}

export interface CardComponent {
    component: any;
    value: any;
}

class CardComponentType {
    priority: number;
    collapse: boolean;
    type: ScryptedDeviceType;
    requiresAnyInterface: Set<string>;
    component: any;

    constructor(type: ScryptedDeviceType, component: any, ...requiresAnyInterface: ScryptedInterface[]) {
        this.component = component;
        this.type = type;
        this.requiresAnyInterface = new Set(requiresAnyInterface);
    }

    supports(device: ScryptedDevice): boolean {
        if (device.type !== this.type) {
            return false;
        }

        for (var iface of device.interfaces) {
            if (this.requiresAnyInterface.has(iface)) {
                return true;
            }
        }
        return false;
    }

    create(name: string, deviceIds: string[]): CardComponent {
        return {
            component: this.component,
            value: {
                name,
                deviceIds,
            }
        }
    }
}

var cardComponentTypes: CardComponentType[] = [];

for (var type of [ScryptedDeviceType.Light, ScryptedDeviceType.Outlet, ScryptedDeviceType.Switch, ScryptedDeviceType.Fan]) {
    cardComponentTypes.push(new CardComponentType(type, {
        component: DashboardToggle,
        value: undefined,
    }, ScryptedInterface.OnOff));
}

function supports(device: ScryptedDevice): boolean {
    for (var cardComponentType of cardComponentTypes) {
        if (cardComponentType.supports(device)) {
            return true;
        }
    }
    return false;
}

export function getDefaultDashboard(deviceIds: string[], systemManager: SystemManager): Card[] {
    // get devices, filter out unsupported
    var devices: ScryptedDevice[] = deviceIds
    .map(device => systemManager.getDeviceById(device))
    .filter(device => supports(device));

    // map devices into rooms.
    var rooms: Multimap<string, ScryptedDevice> = new Multimap();
    devices.forEach(device => rooms.add(device.room || 'Default Room', device));

    devices = [];

    // remove rooms that don't have enough stuff in them.
    for (var [key, roomDevices] of rooms.entries()) {
        if (roomDevices.length < 2) {
            rooms.delete(key);
            devices.push(...roomDevices);
        }
    }

    // map devices into types.
    var types: Multimap<string, ScryptedDevice> = new Multimap();
    devices.forEach(device => types.add(device.type, device));

    return [];
}