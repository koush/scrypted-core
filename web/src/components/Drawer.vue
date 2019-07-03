<template>
  <v-navigation-drawer fixed app v-model="value.drawer" clipped>
    <v-list dense nav>
      <v-subheader></v-subheader>
      <v-list-item
        v-for="item in builtinComponents"
        :key="item.id"
        link
        :to="item.path"
        :ripple="false"
        style="padding: 10px;"
        :active="item.active"
        active-class="purple white--text tile"
      >
        <v-list-item-icon>
          <feather :type="item.icon"></feather>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-light">{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <div dense nav v-for="category in categories" :key="category">
        <v-subheader>{{ category }}</v-subheader>

        <v-list-item
          v-for="item in filterComponents(category)"
          :key="item.id"
          link
          :to="'/component/' + item.id"
          :ripple="false"
          style="padding: 10px;"
          active-class="purple white--text tile"
        >
          <v-list-item-icon>
            <feather :type="item.icon"></feather>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="font-weight-light">{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>
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
      actives: {},
      components: [],
      builtinComponents: [
        {
          id: "dashboard",
          name: "Dashboard",
          icon: "sliders",
          path: "/",
          active: false
        },
        {
          id: "devices",
          name: "Devices",
          icon: "list",
          path: "/device",
          active: false
        }
      ],
      categories: ["Components", "Integrations", "Utilities"]
    };
  }
};
</script>
<style scoped>
.v-list-item:not(.v-list-item--active) .v-list-item__icon {
  color: #a9afbb;
}
.v-list-item:not(.v-list-item--active) .v-list-item__title {
  color: #3c4858;
}
.v-list-item.v-list-item--active .v-list-item__icon,
.v-list-item.v-list-item--active .v-list-item__title {
  color: white;
}
.tile {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
    0 7px 10px -5px rgba(156, 39, 176, 0.4);
}
</style>