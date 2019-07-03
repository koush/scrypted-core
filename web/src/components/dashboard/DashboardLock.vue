<template>
  <v-list-item ripple>
    <v-list-item-icon>
      <font-awesome-icon size="sm" :icon="locked ? 'lock' : 'lock-open'" :color="locked ? '#a9afbb' : 'orange'" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        class="font-weight-light"
      >{{ this.$store.state.systemState[this.deviceId].name.value }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon x-small @click="locked = false">
        <v-icon
          :color="$store.state.systemState[deviceId].lockState.value === 'Locked' ? undefined : 'orange'"
        >lock_open</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action>
      <v-btn icon x-small @click="locked = true">
        <v-icon
          :color="$store.state.systemState[deviceId].lockState.value === 'Locked' ? 'green' : undefined"
        >lock</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import DashboardBase from "./DashboardBase.vue";

export default {
  mixins: [DashboardBase],
  props: ["type", "group", "deviceId"],
  computed: {
    locked: {
      get() {
        return (
          this.$store.state.systemState[this.deviceId].lockState.value ==
          "Locked"
        );
      },
      set(val) {
        const device = this.$scrypted.systemManager.getDeviceById(
          this.deviceId
        );
        if (val) {
          device.lock();
        } else {
          device.unlock();
        }
      }
    }
  }
};
</script>
