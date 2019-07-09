<script lang="ts">
import { ScryptedDeviceType } from "@scrypted/sdk";
import { typeToIcon } from "../helpers";

export default {
  methods: {
    typeToIcon,
    pluralize(type) {
      switch (type) {
        case ScryptedDeviceType.Light:
          return "Lights";
        case ScryptedDeviceType.Outlet:
          return "Outlets";
        case ScryptedDeviceType.Switch:
          return "Switches";
        case ScryptedDeviceType.Lock:
          return "Locks";
        case ScryptedDeviceType.Camera:
          return "Cameras";
      }
      return type;
    },
    getDevice(id) {
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
</script>
