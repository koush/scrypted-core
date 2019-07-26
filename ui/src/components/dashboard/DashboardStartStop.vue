<template>
  <v-list-item ripple :to="getDeviceViewPath(deviceId)">
    <v-list-item-icon>
      <font-awesome-icon
        class="mt-1"
        size="sm"
        :icon="device.docked ? 'home' : device.paused ? 'pause-circle' : device.running ? 'play-circle' : 'stop-circle'"
        :color="device.paused ? 'blue' : device.running ? 'green' : '#a9afbb'"
      />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title class="font-weight-light">{{ name || device.name }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <span>
        <v-btn
          icon
          x-small
          @click.prevent="device.dock()"
          v-if="device.interfaces.includes('Dock')"
        >
          <v-icon color="#a9afbb">home</v-icon>
        </v-btn>
        <v-btn
          icon
          x-small
          @click.prevent="device.pause()"
          v-if="device.interfaces.includes('Pause')"
        >
          <v-icon :color="device.paused ? 'blue' : '#a9afbb'">pause</v-icon>
        </v-btn>
        <v-btn icon x-small @click.prevent="device.stop()">
          <v-icon color="#a9afbb">stop</v-icon>
        </v-btn>
        <v-btn icon x-small @click.prevent="device.start()">
          <v-icon :color="device.running ? 'green' : '#a9afbb'">play_arrow</v-icon>
        </v-btn>
      </span>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import DashboardBase from "./DashboardBase";
import { getDeviceViewPath } from "../helpers";

export default {
  name: "DashboardStartStop",
  mixins: [DashboardBase],
  props: ["name", "deviceId"],
  methods: {
    getDeviceViewPath
  }
};
</script>