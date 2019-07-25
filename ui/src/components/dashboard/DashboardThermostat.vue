<template>
  <v-list-item ripple :to="getDeviceViewPath(value.deviceId)">
    <v-list-item-icon>
      <font-awesome-icon size="sm" :icon="icon" :color="color" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        class="font-weight-light"
      >{{ $store.state.systemState[value.deviceId].name.value }}</v-list-item-title>
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
import colors from "vuetify/es5/util/colors";

export default {
  name: "DashboardThermostat",
  props: ["value"],
  mixins: [DashboardBase],
  methods: {
    getDeviceViewPath
  },

  computed: {
    icon() {
      switch (this.getDevice(this.value.deviceId).thermostatMode) {
        case ThermostatMode.Heat:
          return "fire-alt";
        case ThermostatMode.Cool:
          return "snowflake";
        case ThermostatMode.Eco:
          return "leaf";
      }
      return "thermometer-three-quarters";
    },
    color() {
      const device = this.getDevice(this.value.deviceId);
      if (device.thermostatMode === ThermostatMode.Off) {
        return "#a9afbb";
      }

      if (device.thermostatMode == ThermostatMode.Heat) {
        return colors.orange.base;
      } else if (device.thermostatMode == ThermostatMode.Cool) {
        return colors.blue.base;
      } else if (device.thermostatMode == ThermostatMode.Eco) {
        return colors.green.base;
      }
      return colors.orange.base;
    },
    on: {
      get() {
        return (
          this.getDevice(this.value.deviceId).thermostatMode !== ThermostatMode.Off
        );
      },
      set(val) {
        const device = this.$scrypted.systemManager.getDeviceById(
          this.value.deviceId
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
