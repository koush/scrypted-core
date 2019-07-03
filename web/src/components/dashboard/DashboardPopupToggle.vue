<template>
  <v-list-item ripple>
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
import DashboardBase from "./DashboardBase.vue";
export default {
  props: ["ids", "type", "name", "light"],
  mixins: [DashboardBase],
  computed: {
    on: {
      get() {
        var on = false;
        this.ids.forEach(
          id => (on = on || this.$store.state.systemState[id].on.value)
        );
        return on;
      },
      set(value) {
        this.ids.forEach(id => this.setOnOff(id, value));
      }
    }
  }
};
</script>