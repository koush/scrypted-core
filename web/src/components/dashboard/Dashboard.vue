<template>
  <v-layout wrap>
    <v-flex v-bind="stylesForBreakpoints" v-for="(roomColumn, index) in roomColumns" :key="index">
      <v-flex v-for="room in roomColumn" :key="room.name">
        <v-card raised color="green" dark class="mx-auto">
          <v-card-title>{{ room.name }}</v-card-title>

          <component :type="type" :is="validTypes[type.type].component" v-for="type in room.types" :key="type.type">
          </component>

        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>
<script>
// import Vue from "vue";
// import Vuex from "vuex";
// Vue.use(Vuex);

import { ScryptedDeviceType, ScryptedInterface } from "@scrypted/sdk";
import Toggle from './Toggle.vue';
import Empty from './Empty.vue';
import Camera from './Camera.vue';

const validTypes = [];

const toggles = {
  priority: 30,
  component: 'Toggle',
  collapse: true,
};
toggles[ScryptedInterface.OnOff] = 'Toggle';
validTypes[ScryptedDeviceType.Outlet] =
validTypes[ScryptedDeviceType.Switch] =
validTypes[ScryptedDeviceType.Light] = toggles;

const lock = {
  priority: 20,
  component: 'Empty',
};
lock[ScryptedInterface.Lock] = 'Lock';
// validTypes[ScryptedDeviceType.Lock] = lock;

const sensors = {
  priority: 10,
  component: 'Empty',
};
sensors[ScryptedInterface.Thermometer] = 'Thermometer';
sensors[ScryptedInterface.HumiditySensor] = 'HumiditySensor';
sensors[ScryptedInterface.EntrySensor] = 'EntrySensor';
// validTypes[ScryptedDeviceType.Sensor] = sensors;

const camera = {
  priority: 0,
  component: 'Camera',
  height: 4,
};
camera[ScryptedInterface.VideoCamera] = 'VideoCamera';
validTypes[ScryptedDeviceType.Camera] = camera;

export default {
  components: {
    Toggle,
    Empty,
    Camera,
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
        const ret = cur + (validType.height || 1) * (validType.collapse ? 1 : devices.ids.length);
        return ret;
      }, 1);
    }
  },
  computed: {
    stylesForBreakpoints() {
      const styles = {};
      for (var bp of ['xs', 'sm', 'md', 'lg', 'xl']) {
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
      .filter(([, device]) => device.type && validTypes[device.type.value])
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


      Object.values(ret)
      .forEach(room => {
        room.types = Object.entries(room.types).map(([type, ids]) => ({
          type,
          ids,
        }))
        .sort((a, b) => validTypes[a.type].priority - validTypes[b.type].priority);
      });

      return Object.values(ret);//.filter(room => room.name == 'Exterior');
    }
  }
};
</script>