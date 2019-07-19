import { ScryptedDeviceType, ScryptedDeviceBase } from "@scrypted/sdk";
import { typeToIcon } from "../helpers";

export default {
  methods: {
    typeToIcon,
    pluralize(type) {
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
    },
    getDevice(id): ScryptedDeviceBase {
      return this.$scrypted.systemManager.getDeviceById(id);
    },
    setOnOff(id, value) {
      const device = this.getDevice(id);
      if (value) {
        device.turnOn();
      } else {
        device.turnOff();
      }
    }
  }
};
