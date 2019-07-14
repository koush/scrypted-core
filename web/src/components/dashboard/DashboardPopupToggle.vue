<template>
  <v-list-item ripple :to="getDeviceViewPath(id)">
    <v-list-item-icon>
      <font-awesome-icon
        size="sm"
        :icon="typeToIcon(type)"
        :color="on ? 'orange' : '#a9afbb'"
      />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title class="font-weight-light">{{ name }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <v-switch inset v-model="on" color="white" :light="light"></v-switch>
    </v-list-item-action>
  </v-list-item>
</template>
<script lang="ts">
import {getDeviceViewPath} from "../helpers";
import DashboardBase from "./DashboardBase.vue";
export default {
  props: ["id", "type", "name", "light"],
  mixins: [DashboardBase],
  methods: {
    getDeviceViewPath,
  },
  computed: {
    on: {
      get() {
        return this.$store.state.systemState[this.id].on.value;
      },
      set(value) {
        this.setOnOff(this.id, value);
      }
    }
  }
};
</script>