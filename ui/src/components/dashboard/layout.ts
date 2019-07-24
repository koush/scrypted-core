import { SystemManager, ScryptedDeviceType, ScryptedDevice, ScryptedInterface } from "@scrypted/sdk";
import DashboardMap from "./DashboardMap.vue";
import DashboardToggle from "./DashboardToggle.vue";
import DashboardCamera from "./DashboardCamera.vue";
import DashboardLock from "./DashboardLock.vue";
import DashboardThermostat from "./DashboardThermostat.vue";
import { Multimap, EnsureMap } from "./multimap";

export interface Card {
    name: string;
    components: CardComponent[];
    height: number;
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
    height: number;
    component: any;

    constructor(type: ScryptedDeviceType, priority: number, collapse: boolean, height: number, component: any, ...requiresAnyInterface: ScryptedInterface[]) {
        this.component = component;
        this.type = type;
        this.priority = priority;
        this.collapse = collapse;
        this.height = height;
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

    create(name: string, devices: ScryptedDevice[]): CardComponent {
        if (this.collapse) {
            return {
                component: this.component,
                value: {
                    name,
                    devices: devices.map(device => device.id),
                }
            };
        }

        return {
            component: this.component,
            value: {
                name: devices[0].name,
                device: devices[0].id,
            }
        };
    }

    clone(): CardComponentType {
        var ret = new CardComponentType(this.type, this.priority, this.collapse, this.height, this.component, ...[]);
        ret.requiresAnyInterface = this.requiresAnyInterface;
        return ret;
    }
}

function pluralize(type): string {
    switch (type) {
        case ScryptedDeviceType.Light:
            return "Lights";
        case ScryptedDeviceType.Fan:
            return "Fans";
        case ScryptedDeviceType.Outlet:
            return "Outlets";
        case ScryptedDeviceType.Switch:
            return "Switches";
        case ScryptedDeviceType.Lock:
            return "Locks";
        case ScryptedDeviceType.Camera:
            return "Cameras";
        case ScryptedDeviceType.Thermostat:
            return "Thermostats";
    }
    return type;
}

var cardComponentTypes: CardComponentType[] = [];

for (var type of [ScryptedDeviceType.Light, ScryptedDeviceType.Outlet, ScryptedDeviceType.Switch, ScryptedDeviceType.Fan]) {
    cardComponentTypes.push(new CardComponentType(type, 30, true, 1, {
        component: DashboardToggle,
        value: undefined,
    }, ScryptedInterface.OnOff));
}

export function getDefaultDashboard(deviceIds: string[], systemManager: SystemManager): Card[] {
    var supportedType: Map<ScryptedDevice, CardComponentType> = new Map();
    function supports(device: ScryptedDevice): boolean {
        for (var cardComponentType of cardComponentTypes) {
            if (cardComponentType.supports(device)) {
                supportedType.set(device, cardComponentType.collapse ? cardComponentType : cardComponentType.clone());
                return true;
            }
        }
        return false;
    }

    // get devices, filter out unsupported
    var devices: ScryptedDevice[] = deviceIds
        .map(device => systemManager.getDeviceById(device))
        .filter(device => supports(device));

    // map devices into rooms/types.
    var rooms: EnsureMap<string, Multimap<CardComponentType, ScryptedDevice>> = new EnsureMap(() => new Multimap());
    devices.forEach(device => rooms.ensure(device.room || 'Default Room').add(supportedType.get(device), device));

    devices = [];

    // remove rooms that don't have enough stuff in them.
    for (let [room, roomTypes] of rooms.entries()) {
        if (roomTypes.size < 2) {
            rooms.delete(room);
            for (let roomTypeDevices of roomTypes.values()) {
                devices.push(...roomTypeDevices);
            }
        }
    }


    var types: EnsureMap<CardComponentType, Multimap<string, ScryptedDevice>> = new EnsureMap(() => new Multimap());
    devices.forEach(device => types.ensure(supportedType.get(device)).add(device.room || 'Default Room', device));

    var ret: Card[] = [];
    for (let [room, roomTypes] of rooms.entries()) {
        let components: CardComponent[] = [];
        let height = 0;
        for (let [roomType, roomTypeDevices] of roomTypes.entries()) {
            components.push(roomType.create(`${pluralize(roomType.type)}`, roomTypeDevices));
            height += roomType.height;
        }

        let card: Card = {
            name: room,
            components,
            height,
        }
        ret.push(card);
    }

    return [];
}