import { ScryptedDeviceType, ScryptedDeviceBase } from "@scrypted/sdk";
import { typeToIcon } from "../helpers";

export default {
  props: ['deviceId', 'deviceIds'],
  methods: {
    typeToIcon,
    cleanupListeners() {
      if (this.listener) {
        this.listener.removeListener();
        this.listeners = null;
        return;
      }
      if (this.listeners) {
        this.listeners.forEach(listener => listener.removeListener());
        this.listeners = null;
      }
    },
    listen() {
      if (this.deviceId && this.device.interfaces.includes("Refresh")) {
        this.listener = this.device.listen("Refresh", () => {});
      }
      if (this.deviceIds) {
        this.listeners = [];
        this.devices.forEach(device => {
          if (device.interfaces.includes("Refresh")) {
            this.listeners.push(device.listen("Refresh", () => {}));
          }
        });
      }
    }
  },
  mounted() {
    this.listen();
  },
  destroyed() {
    this.cleanupListeners();
  },
  watch: {

  },
  computed: {
    device() {
      return this.$scrypted.systemManager.getDeviceById(this.deviceId);
    },
    devices() {
      return this.deviceIds.map(deviceId => this.$scrypted.systemManager.getDeviceById(deviceId));
    },
  }
};
