import { ScryptedDeviceType } from "@scrypted/sdk";

export function typeToIcon(type) {
    switch (type) {
        case ScryptedDeviceType.Camera: return "video";
        case ScryptedDeviceType.Fan: return "angle-double-right";
        case ScryptedDeviceType.Light: return "lightbulb";
        case ScryptedDeviceType.Switch: return "toggle-on";
        case ScryptedDeviceType.Outlet: return "plug";
        case ScryptedDeviceType.Sensor: return "exclamation-triangle";
        case ScryptedDeviceType.Scene: return "sun";
        case ScryptedDeviceType.Program: return "code";
        case ScryptedDeviceType.Automation: return "bolt";
        case ScryptedDeviceType.Event: return "exclamation";
        case ScryptedDeviceType.Vacuum: return "trash";
        case ScryptedDeviceType.Notifier: return "bell";
        case ScryptedDeviceType.Lock: return "unlock-alt";
        case ScryptedDeviceType.Thermostat: return "thermometer-three-quarters";
        case ScryptedDeviceType.PasswordControl: return "key";
        case ScryptedDeviceType.Display: return "tv";
        case ScryptedDeviceType.Speaker: return "volume-up";
        case ScryptedDeviceType.Entry: return "warehouse";
        case ScryptedDeviceType.Garage: return "warehouse";
        case ScryptedDeviceType.DeviceProvider: return "database";
        case ScryptedDeviceType.API: return "cloud";
        case ScryptedDeviceType.DataSource: return "chart-area";
        case ScryptedDeviceType.Unknown: return "question-circle";

    }
    return "toggle-on";
}

export function getComponentName(id: string) {
    switch (id) {
        case "script":
            return "Plugins";
        case "aggregate":
            return "Device Groups";
        case "mail":
            return "Incoming Mail";
        case "webpush":
            return "Web Push Notifier";
        case "automation":
            return "Automations";
    }
    return "Unknown Component";
}