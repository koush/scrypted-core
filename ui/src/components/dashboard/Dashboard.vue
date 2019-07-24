<template>
  <v-layout>
    <v-flex v-if="!roomColumns.length" xs12 md6 lg4>
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
      v-for="(roomColumn, index) in roomColumns"
      :key="index"
    >
      <v-flex v-for="(room, roomIndex) in roomColumn" :key="room.name">
        <v-card raised class="header-card">
          <v-card-title
            :class="randomGradient(index * 4 + roomIndex)"
            class="subtitle-1 text--white header-card-gradient font-weight-light"
          >
            {{ room.name }}
            <div
              style="position: absolute; right: 10px"
              v-for="type in room.types"
              :key="type.name || type.type"
            >
              <component
                v-if="validTypes[type.type].collapse && type.type == 'Sensor'"
                :group="room.name"
                :type="type"
                :is="validTypes[type.type].component"
              ></component>
            </div>
          </v-card-title>
          <div class="header-card-spacer"></div>

          <v-list flat class="header-card-content">
            <v-list-item-group>
              <div v-for="type in room.types" :key="type.name || type.type">
                <div v-if="type.type != 'Sensor'">
                  <component
                    v-if="validTypes[type.type].collapse"
                    :group="type.name || (room.name || pluralize(type.type))"
                    :type="type"
                    :is="validTypes[type.type].component"
                  ></component>
                  <component
                    v-else
                    v-for="deviceId in type.ids"
                    :key="deviceId"
                    :group="type.name || (room.name || pluralize(type.type))"
                    :deviceId="deviceId"
                    :is="validTypes[type.type].component"
                  ></component>
                </div>
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

import {getDefaultDashboard} from "./layout";

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
  collapse: true,
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
    roomColumns() {
      var rooms = this.rooms;
      const columns = [];

      for (var room of rooms) {
        // find teh column with the leeast juink
        if (columns.length < this.columnsForBreakpoint) {
          columns.push([room]);
          continue;
        }

        const least = columns.reduce((a, b) =>
          a.reduce((c, d) => c + this.heightForTypes(d), 0) <
          b.reduce((c, d) => c + this.heightForTypes(d), 0)
            ? a
            : b
        );
        least.push(room);
      }

      return columns;
    },
    validTypes() {
      return validTypes;
    },
    rooms() {
      var ret = {};
      this.$store.state.scrypted.devices
        .map(id => [id, this.$store.state.systemState[id]])
        // filter out devices we can't show in the ui
        .filter(([, device]) => {
          return device.type && validTypes[device.type.value]; // && device.metadata.value.syncWithIntegrations;
        })
        // verify the interfaces we need exist on the devices we can use.
        .filter(([, device]) => {
          if (!device.interfaces || !device.interfaces.value) {
            return false;
          }

          for (var iface of device.interfaces.value) {
            if (validTypes[device.type.value][iface]) {
              return true;
            }
          }
          return false;
        })
        // group the devices into rooms
        .forEach(([id, device]) => {
          const name = device.room.value || "Default Room";
          var room = (ret[name] = ret[name] || {
            name,
            types: {}
          });
          const typeKey =
            validTypes[device.type.value].typeKey || device.type.value;
          var type = (room.types[typeKey] = room.types[typeKey] || []);
          type.push(id);
        });

      // find rooms that only have a couple device types, and merge them
      const singles = [];
      Object.values(ret).forEach(room => {
        if (Object.keys(room.types).length <= 2) {
          delete ret[room.name];
          singles.push(room);
        }
      });

      const merged = {};
      singles.forEach(single => {
        Object.keys(single.types).forEach(type => {
          const name = this.pluralize(type);
          const group = (merged[name] = merged[name] || {
            name,
            type,
            types: {}
          });
          const roomType = `${single.name} ${this.pluralize(type)}`;
          group.types[roomType] = group.types[roomType] || [];
          group.types[roomType].push(...single.types[type]);
        });
      });

      Object.assign(ret, merged);

      // single.types[type].length === 1 ? this.$store.state.systemState[single.types[type][0]].name.value :

      // massage the room types into array which is easier to use
      // sort by priority.
      Object.values(ret).forEach(room => {
        room.types = Object.entries(room.types)
          .map(([type, ids]) => ({
            name:
              ids.length === 1
                ? this.$store.state.systemState[ids[0]].name.value
                : room.type
                ? type
                : undefined,
            type: room.type || type,
            ids
          }))
          .sort(
            (a, b) => validTypes[a.type].priority - validTypes[b.type].priority
          );
      });

      ret = Object.values(ret);

      var map = {
        name: "Map",
        types: [
          {
            name: "PositionSensor",
            ids: [],
            type: "Map"
          }
        ]
      };
      this.$store.state.scrypted.devices
        .map(id => [id, this.$store.state.systemState[id]])
        .filter(([, device]) => {
          return device.interfaces.value.includes(
            ScryptedInterface.PositionSensor
          );
        })
        .forEach(([id,]) => {
          map.types[0].ids.push(id);
        });

      if (map.types[0].ids.length) {
        ret.push(map);
      }

      return ret;
    }
  }
};
</script>
<style>
</style>
