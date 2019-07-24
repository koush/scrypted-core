<template>
  <v-layout>
    <v-flex v-if="!cardColumns.length" xs12 md6 lg4>
      <v-flex>
        <v-card raised class="header-card">
          <v-card-title
            class="red-gradient subtitle-1 text--white header-card-gradient font-weight-light"
          >No Devices Found</v-card-title>
          <div class="header-card-spacer"></div>
          <v-card-text>No devices found, install a plugin to add support for your things</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="primary" dark text to="/component/script/install">
              Install Plugins
              <v-icon right color="primary">cloud_download</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-flex>

    <v-flex
      v-else
      v-bind="stylesForBreakpoints"
      v-for="(cardColumn, index) in cardColumns"
      :key="index"
    >
      <v-flex v-for="(card, cardIndex) in cardColumn" :key="card.name">
        <v-card raised class="header-card">
          <v-card-title
            :class="randomGradient(index * 4 + cardIndex)"
            class="subtitle-1 text--white header-card-gradient font-weight-light"
          >
            {{ card.name }}
          </v-card-title>
          <div class="header-card-spacer"></div>

          <v-list flat class="header-card-content">
            <v-list-item-group>
              <div v-for="(component, componentIndex) in card.components" :key="componentIndex">
                <component
                  :value="component.value"
                  :is="component.component"
                ></component>
              </div>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>
<script>
import { ScryptedDeviceType, ScryptedInterface } from "@scrypted/sdk";
import DashboardMap from "./DashboardMap.vue";
import DashboardToggle from "./DashboardToggle.vue";
import DashboardCamera from "./DashboardCamera.vue";
import DashboardLock from "./DashboardLock.vue";
import DashboardThermostat from "./DashboardThermostat.vue";
import DashboardSensors from "./DashboardSensors.vue";
import DashboardBase from "./DashboardBase";
import "../header-card.css";

import { getDefaultDashboard } from "./layout";

const validTypes = [];

const toggles = {
  priority: 30,
  component: DashboardToggle,
  collapse: true
};
toggles[ScryptedInterface.OnOff] = "Toggle";
validTypes[ScryptedDeviceType.Outlet] = validTypes[
  ScryptedDeviceType.Switch
] = validTypes[ScryptedDeviceType.Light] = validTypes[
  ScryptedDeviceType.Fan
] = toggles;

const lock = {
  priority: 20,
  component: "DashboardLock"
};
lock[ScryptedInterface.Lock] = "Lock";
validTypes[ScryptedDeviceType.Lock] = lock;

const thermostat = {
  priority: 20,
  component: "DashboardThermostat"
};
thermostat[ScryptedInterface.TemperatureSetting] = "TemperatureSetting";
validTypes[ScryptedDeviceType.Thermostat] = thermostat;

const sensors = {
  priority: 10,
  component: "DashboardSensors",
  collapse: true,
  typeKey: "Sensor"
};
sensors[ScryptedInterface.Thermometer] = "Thermometer";
sensors[ScryptedInterface.HumiditySensor] = "HumiditySensor";
sensors[ScryptedInterface.EntrySensor] = "EntrySensor";
// validTypes[ScryptedDeviceType.Sensor] = sensors;
// validTypes[ScryptedDeviceType.Thermostat] = sensors;

const videoCamera = {
  priority: 0,
  component: "DashboardCamera",
  height: 4
};
videoCamera[ScryptedInterface.Camera] = "Camera";
videoCamera[ScryptedInterface.VideoCamera] = "VideoCamera";
validTypes[ScryptedDeviceType.Camera] = videoCamera;

const position = {
  priority: 0,
  component: "DashboardMap",
  height: 6,
  collapse: true
};
position[ScryptedInterface.PositionSensor] = "PositionSensor";
validTypes["Map"] = position;

const randoms = [];
for (var rrr = 0; rrr < 100; rrr++) {
  randoms.push(Math.round(Math.random() * 10000));
}

export default {
  mixins: [DashboardBase],
  components: {
    DashboardMap,
    DashboardToggle,
    DashboardCamera,
    DashboardLock,
    DashboardSensors,
    DashboardThermostat
  },
  methods: {
    getColumnsForBreakpoint(bp) {
      switch (bp) {
        case "xl":
          return 4;
        case "lg":
          return 3;
        case "md":
          return 2;
        case "sm":
          return 2;
        case "xs":
          return 1;
      }
      return 1;
    },
    heightForTypes(d) {
      return d.types.reduce((cur, devices) => {
        const validType = validTypes[devices.type];
        const ret =
          cur +
          (validType.height || 1) *
            (validType.collapse ? 1 : devices.ids.length);
        return ret;
      }, 1);
    },
    randomGradient(i) {
      const gradients = [
        "purple-gradient",
        "orange-gradient",
        "red-gradient",
        "green-gradient"
      ];
      return gradients[randoms[i % 100] % 4];
    }
  },
  computed: {
    stylesForBreakpoints() {
      const styles = {};
      for (var bp of ["xs", "sm", "md", "lg", "xl"]) {
        let w = this.getColumnsForBreakpoint(bp);
        styles[`${bp}${12 / w}`] = true;
      }
      return styles;
    },
    columnsForBreakpoint() {
      return this.getColumnsForBreakpoint(this.$vuetify.breakpoint.name);
    },
    cardColumns() {
      var cards = this.cards;
      const columns = [];

      for (var card of cards) {
        // find teh column with the leeast juink
        if (columns.length < this.columnsForBreakpoint) {
          columns.push([card]);
          continue;
        }

        const least = columns.reduce((a, b) =>
          a.reduce((c, d) => c + d.height, 0) <
          b.reduce((c, d) => c + d.height, 0)
            ? a
            : b
        );
        least.push(card);
      }

      return columns;
    },
    validTypes() {
      return validTypes;
    },
    cards() {
      return getDefaultDashboard(
        this.$store.state.scrypted.devices,
        this.$scrypted.systemManager
      );
    },
  }
};
</script>
<style>
</style>
