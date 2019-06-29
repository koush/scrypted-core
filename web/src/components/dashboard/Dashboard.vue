<template>
  <v-layout wrap>
    <v-flex v-bind="stylesForBreakpoints" v-for="(roomColumn, index) in roomColumns" :key="index">
      <v-flex v-for="(room, roomIndex) in roomColumn" :key="room.name">
        <v-card raised class="header-card">
          <v-card-title
            :class="randomGradient(index * 4 + roomIndex)"
            class="subtitle-1 text--white header-card-gradient font-weight-light"
          >{{ room.name }}</v-card-title>
          <v-list flat class="header-card-content">
            <v-list-item-group>
              <div v-for="type in room.types" :key="type.name || type.type">
                <component v-if="validTypes[type.type].collapse" :group="room.name" :type="type" :is="validTypes[type.type].component"></component>
                <component v-else v-for="deviceId in type.ids" :key="deviceId" :group="room.name" :deviceId="deviceId" :is="validTypes[type.type].component"></component>
              </div>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>
<script lang="ts">
// import Vue from "vue";
// import Vuex from "vuex";
// Vue.use(Vuex);

import { ScryptedDeviceType, ScryptedInterface } from "@scrypted/sdk";
import Toggle from "./Toggle.vue";
import Empty from "./Empty.vue";
import Camera from "./Camera.vue";
import Lock from "./Lock.vue";
import Base from "./Base.vue";

interface Foo {
  poops: number;
}

const validTypes = [];

const toggles = {
  priority: 30,
  component: "Toggle",
  collapse: true
};
toggles[ScryptedInterface.OnOff] = "Toggle";
validTypes[ScryptedDeviceType.Outlet] = validTypes[
  ScryptedDeviceType.Switch
] = validTypes[ScryptedDeviceType.Light] = toggles;

const lock = {
  priority: 20,
  component: "Lock"
};
lock[ScryptedInterface.Lock] = "Lock";
validTypes[ScryptedDeviceType.Lock] = lock;

const sensors = {
  priority: 10,
  component: "Empty"
};
sensors[ScryptedInterface.Thermometer] = "Thermometer";
sensors[ScryptedInterface.HumiditySensor] = "HumiditySensor";
sensors[ScryptedInterface.EntrySensor] = "EntrySensor";
// validTypes[ScryptedDeviceType.Sensor] = sensors;

const camera = {
  priority: 0,
  component: "Camera",
  height: 4
};
camera[ScryptedInterface.VideoCamera] = "VideoCamera";
validTypes[ScryptedDeviceType.Camera] = camera;

const randoms = [];
for (var rrr = 0; rrr < 100; rrr++) {
  randoms.push(Math.round(Math.random() * 10000));
}

export default {
  mixins: [Base],
  components: {
    Toggle,
    Empty,
    Camera,
    Lock
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
        .filter(([, device]) => device.type && validTypes[device.type.value])
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
          var type = (room.types[device.type.value] =
            room.types[device.type.value] || []);
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
.header-card {
  margin-bottom: 20px;
}
.purple-gradient {
  background: linear-gradient(60deg, #ab47bc, #8e24aa);
}
.red-gradient {
  background: linear-gradient(60deg, #ef5350, #e53935);
}
.orange-gradient {
  background: linear-gradient(60deg, #ffa726, #fb8c00);
}
.green-gradient {
  background: linear-gradient(60deg, #66bb6a, #43a047);
}
.header-card-gradient {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  color: white;
  width: 90%;
  margin-top: -20px;
  margin-left: 5%;
  position: absolute;
  padding-top: 10px;
  padding-bottom: px;
}
.header-card-content {
  padding-top: 40px;
}
</style>