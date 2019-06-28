<template>
  <v-list-item>
    <v-list-item-icon>
      <!-- <v-icon>power_settings_new</v-icon> -->
      <font-awesome-icon size="sm" :icon="typeToIcon(type.type)" :color="on ? 'yellow' : 'white'" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ pluralize(type.type) }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <v-switch ref="toggle" light inset color="white" class="text--white" v-model="on"></v-switch>
    </v-list-item-action>
  </v-list-item>
</template>
<script lang="ts">
import { ScryptedDeviceType } from "@scrypted/sdk";
export default {
  props: ["type"],
  methods: {
    typeToIcon(type) {
      switch (type) {
        case ScryptedDeviceType.Light:
          return "lightbulb";
        case ScryptedDeviceType.Outlet:
          return "plug";
      }
      return "toggle-on";
    },
    pluralize(type) {
    switch (type) {
        case ScryptedDeviceType.Light:
          return "Lights";
        case ScryptedDeviceType.Outlet:
          return "Outlets";
        case ScryptedDeviceType.Switch:
          return "Switches";
      }
      return type;
    }
  },
  computed: {
    on: {
      get() {
        var on = false;
        this.type.ids.forEach(
          id => (on = on || this.$store.state.systemState[id].on.value)
        );
        return on;
      },
      set(value) {
        this.type.ids.forEach(id => {
          const device = this.$scrypted.systemManager.getDeviceById(id);
          if (value) {
            device.turnOn();
          } else {
            device.turnOff();
          }
        });
      }
    }
  }
};
</script>