<template>
  <v-list-item ripple :to="getDeviceViewPath(deviceId)">
    <v-list-item-icon>
      <font-awesome-icon size="sm" :icon="icon" :color="color" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        class="font-weight-light"
      >{{ this.$store.state.systemState[this.deviceId].name.value }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <v-switch color="indigo" inset v-model="on" @click.stop></v-switch>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import { getDeviceViewPath } from "../helpers";
import { ThermostatMode } from "@scrypted/sdk";
import DashboardBase from "./DashboardBase";

export default {
  props: ["type", "group", "deviceId"],
  mixins: [DashboardBase],
  methods: {
    getDeviceViewPath
  },

  computed: {
    icon() {
      switch (this.getDevice(this.deviceId).thermostatMode) {
        case ThermostatMode.Heat:
          return "fire-alt";
        case ThermostatMode.Cool:
          return "snowflake";
      }
      return "thermometer-three-quarters";
    },
    color() {
      const device = this.getDevice(this.deviceId);
      if (device.thermostatMode === ThermostatMode.Off) {
        return "#a9afbb";
      }

      if (device.thermostatMode == ThermostatMode.Heat) {
        return "orange";
      } else if (device.thermostatMode == ThermostatMode.Cool) {
        return "blue";
      }
      return "orange";
    },
    on: {
      get() {
        return (
          this.getDevice(this.deviceId).thermostatMode !== ThermostatMode.Off
        );
      },
      set(val) {
        const device = this.$scrypted.systemManager.getDeviceById(
          this.deviceId
        );
        if (val) {
          device.setThermostatMode(ThermostatMode.On);
        } else {
          device.setThermostatMode(ThermostatMode.Off);
        }
      }
    }
  }
};
</script>
