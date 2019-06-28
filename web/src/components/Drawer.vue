<template>
  <v-navigation-drawer fixed app v-model="value.drawer" dark clipped>
    <v-list dense nav>
      <!-- <v-list-item>
        <v-list-item-icon>
          <feather type="cpu"></feather>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">SCRYPTED</v-list-item-title>
          <v-list-item-subtitle>Management Console</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider> -->

      <!-- <v-subheader></v-subheader> -->
      <v-list-item v-for="item in builtinComponents" :key="item.id" link :to="item.path" color="white">
        <v-list-item-icon>
          <feather :type="item.icon"></feather>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list dense nav v-for="category in categories" :key="category">
      <v-subheader>{{ category }}</v-subheader>

      <v-list-item v-for="item in filterComponents(category)" :key="item.id" link :to="'/' + item.id" color="white">
        <v-list-item-icon>
          <feather :type="item.icon"></feather>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider dark></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    value: Object
  },
  created: async function() {
    fetch("/endpoint/@scrypted/ui/api/components")
      .then(response => response.json())
      .then(json => {
        this.$data.components.push(...json);
      })
      .catch();
  },
  methods: {
    filterComponents: function(category) {
      return this.$data.components.filter(
        component => component.category == category
      );
    }
  },
  data: function() {
    return {
      components: [],
      builtinComponents: [
        {
          id: "dashboard",
          name: "Dashboard",
          icon: "sliders",
          path: "/"
        },
        {
          id: "devices",
          name: "All Devices",
          icon: "list",
          path: "/devices"
        }
      ],
      categories: ["Components", "Integrations", "Utilities"]
    };
  }
};
</script>