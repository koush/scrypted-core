<template>
  <v-card raised color="blue" dark>
    <v-card-title>
      All Devices
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table
      light
      :headers="headers"
      :items="tableDevices"
      :items-per-page="50"
      :search="search"
    >
      <template v-slot:item.icon="{ item }">
        <font-awesome-icon size="sm" :icon="item.icon" :color="colors.blue.base"/>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import colors from "vuetify/es5/util/colors";

export default {
  created: async function() {
    fetch("/endpoint/@scrypted/ui/api/devices")
      .then(response => response.json())
      .then(json => {
        this.$data.devices.push(...json);
      })
      .catch();
  },
  methods: {
    getOwner(device) {
      if (device.owner) {
        return device.owner;
      }
      return;
    }
  },
  computed: {
    tableDevices() {
      return this.devices.map(device =>
        Object.assign(
          {
            plugin: (device.owner || device.component).name
          },
          device
        )
      );
    },
    headers() {
      var ret = [];
      if (this.$vuetify.breakpoint.smAndUp) {
        ret.push({
          width: 40,
          text: "",
          align: "left",
          sortable: false,
          value: "icon"
        });
      }

      ret.push({
        text: "Name",
        align: "left",
        sortable: true,
        value: "name"
      });

      if (this.$vuetify.breakpoint.smAndUp) {
        ret.push({
          text: "Type",
          align: "left",
          sortable: true,
          value: "type"
        });
      }
      if (this.$vuetify.breakpoint.mdAndUp) {
        ret.push({
          text: "Plugin",
          align: "left",
          sortable: true,
          value: "plugin"
        });
      }
      return ret;
    }
  },
  data: function() {
    return {
      search: "",
      colors,
      devices: []
    };
  }
};
</script>