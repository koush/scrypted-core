<template>
  <v-layout wrap>
    <v-flex v-bind="stylesForBreakpoints" v-for="(roomColumn, index) in roomColumns" :key="index">
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
                    :group="room.name"
                    :type="type"
                    :is="validTypes[type.type].component"
                  ></component>
                  <component
                    v-else
                    v-for="deviceId in type.ids"
                    :key="deviceId"
                    :group="room.name"
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
<script lang="ts">
import { ScryptedDeviceType, ScryptedInterface } from "@scrypted/sdk";
import DashboardToggle from "./DashboardToggle.vue";
import DashboardCamera from "./DashboardCamera.vue";
import DashboardLock from "./DashboardLock.vue";
import DashboardSensors from "./DashboardSensors.vue";
import DashboardBase from "./DashboardBase.vue";
import "../header-card.css";

const validTypes = [];

const toggles = {
  priority: 30,
  component: "DashboardToggle",
  collapse: true
};
toggles[ScryptedInterface.OnOff] = "Toggle";
validTypes[ScryptedDeviceType.Outlet] = validTypes[
  ScryptedDeviceType.Switch
] = validTypes[ScryptedDeviceType.Light] = toggles;

const lock = {
  priority: 20,
  component: "DashboardLock"
};
lock[ScryptedInterface.Lock] = "Lock";
validTypes[ScryptedDeviceType.Lock] = lock;

const sensors = {
  priority: 10,
  component: "DashboardSensors",
  collapse: true,
  typeKey: "Sensor"
};
sensors[ScryptedInterface.Thermometer] = "Thermometer";
sensors[ScryptedInterface.HumiditySensor] = "HumiditySensor";
sensors[ScryptedInterface.EntrySensor] = "EntrySensor";
validTypes[ScryptedDeviceType.Sensor] = sensors;
validTypes[ScryptedDeviceType.Thermostat] = sensors;

const camera = {
  priority: 0,
  component: "DashboardCamera",
  height: 4
};
camera[ScryptedInterface.VideoCamera] = "VideoCamera";
validTypes[ScryptedDeviceType.Camera] = camera;

const randoms = [];
for (var rrr = 0; rrr < 100; rrr++) {
  randoms.push(Math.round(Math.random() * 10000));
}

export default {
  mixins: [DashboardBase],
  components: {
    DashboardToggle,
    DashboardCamera,
    DashboardLock,
    DashboardSensors
  },
  methods: {
    getColumnsForBreakpoint(bp) {
      switch (bp) {
        case "xl":
          return 4;
        case "lg":
          return 3;
        case "md":
          return 3;
        case "sm":
          return 2;
        case "xs":
          return 1;
      }
      return 1;
    },
    heightForTypes(d) {
      return d.types.reduce((cur, devices) => {
        const validType = this.validTypes[devices.type];
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
      var validTypes = this.validTypes;

      var ret = {};
      Object.entries(this.$store.state.systemState)
        // filter out devices we can't show in the ui
        .filter(([, device]) => {
          return device.type && validTypes[device.type.value];
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

      // find rooms that only have 1 device type, and merge them
      const singles = [];
      Object.values(ret).forEach(room => {
        if (Object.keys(room.types).length == 1) {
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

      // massage the room types into array which is easier to use
      // sort by priority.
      Object.values(ret).forEach(room => {
        room.types = Object.entries(room.types)
          .map(([type, ids]) => ({
            name: room.type ? type : undefined,
            type: room.type || type,
            ids
          }))
          .sort(
            (a, b) => validTypes[a.type].priority - validTypes[b.type].priority
          );
      });

      ret = Object.values(ret);

      return ret;
    }
  }
};
</script>
<style>
</style>
