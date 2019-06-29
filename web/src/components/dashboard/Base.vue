<script lang="ts">
import { ScryptedDeviceType } from "@scrypted/sdk";
export default {
  methods: {
    typeToIcon(type) {
      switch (type) {
        case ScryptedDeviceType.Light:
          return "lightbulb";
        case ScryptedDeviceType.Outlet:
          return "plug";
        case ScryptedDeviceType.Lock:
          return "lock";
      }
      return "toggle-on";
    },
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
      }
      return type;
    },
    setOnOff(id, value) {
      const device = this.$scrypted.systemManager.getDeviceById(id);
      if (value) {
        device.turnOn();
      } else {
        device.turnOff();
      }
    }
  }
};
</script>
