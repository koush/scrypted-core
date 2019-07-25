<template>
  <div>
    <div v-if="editMode">
      <v-card>
        <v-card-title>Edit Layout</v-card-title>
        <v-form>
          <v-container>
            <v-layout>
              <v-flex>
                <v-switch v-model="cardAlignCenter" label="Align Center"></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="blue" @click="saveLayout">Save</v-btn>
          <v-btn text color="primary" @click="editMode = !editMode">Done</v-btn>
        </v-card-actions>
      </v-card>
      <div class="header-card-spacer"></div>
    </div>

    <v-layout :align-center="cardAlignCenter">
      <v-flex v-if="!cardColumns.length" xs12 md6 lg4>
        <v-flex>
          <v-card raised class="header-card">
            <v-card-title
              class="red-gradient subtitle-1 text--white header-card-gradient font-weight-light"
            >No Devices Found</v-card-title>
            <div class="header-card-spacer"></div>
            <v-card-text>No devices found, install a plugin to add support for your things</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="primary" dark text to="/component/script/install">
                Install Plugins
                <v-icon right color="primary">cloud_download</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-flex>

      <v-flex
        v-else
        v-bind="stylesForBreakpoints"
        v-for="(cardColumn, index) in cardColumns"
        :key="index"
      >
        <v-flex v-for="(card, cardIndex) in cardColumn" :key="card.name">
          <v-card raised class="header-card">
            <v-card-title
              :class="card.color"
              class="subtitle-1 text--white header-card-gradient font-weight-light"
            >{{ card.name }}</v-card-title>
            <div class="header-card-spacer"></div>

            <v-card-actions v-if="editMode">
              <v-layout align-center justify-center>
                <v-btn dark fab color="green" @click="card.color = 'green-gradient'"></v-btn>
                <v-btn dark fab color="purple" @click="card.color = 'purple-gradient'"></v-btn>
                <v-btn dark fab color="red" @click="card.color = 'red-gradient'"></v-btn>
                <v-btn dark fab color="orange" @click="card.color = 'orange-gradient'"></v-btn>
              </v-layout>
            </v-card-actions>

            <v-list flat class="header-card-content">
              <v-list-item-group>
                <div v-for="(component, componentIndex) in card.components" :key="componentIndex">
                  <component :value="component.value" :is="component.component"></component>
                </div>
              </v-list-item-group>
            </v-list>

            <v-card-actions v-if="editMode">
              <v-btn icon @click="moveCard(index, cardIndex, -1, 0)">
                <v-icon>arrow_left</v-icon>
              </v-btn>
              <v-btn icon @click="moveCard(index, cardIndex, 0, 1)">
                <v-icon>arrow_drop_down</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="moveCard(index, cardIndex, 0, -1)">
                <v-icon>arrow_drop_up</v-icon>
              </v-btn>
              <v-btn icon @click="moveCard(index, cardIndex, 1, 0)">
                <v-icon>arrow_right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import DashboardMap from "./DashboardMap.vue";
import DashboardToggle from "./DashboardToggle.vue";
import DashboardCamera from "./DashboardCamera.vue";
import DashboardLock from "./DashboardLock.vue";
import DashboardThermostat from "./DashboardThermostat.vue";
import DashboardSensors from "./DashboardSensors.vue";
import DashboardBase from "./DashboardBase";
import "../header-card.css";

import { getDefaultDashboard } from "./layout";
import { Menu } from "../../store";

const randoms = [];
for (var rrr = 0; rrr < 100; rrr++) {
  randoms.push(Math.round(Math.random() * 10000));
}

export default {
  mixins: [DashboardBase],
  components: {
    DashboardMap,
    DashboardToggle,
    DashboardCamera,
    DashboardLock,
    DashboardSensors,
    DashboardThermostat
  },
  data() {
    return {
      editMode: false,
      cardColumns: [],
      cardAlignCenter: false
    };
  },
  mounted() {
    var menu: Menu[] = [
      {
        title: "Toggle Edit Layout",
        icon: "edit",
        click: () => {
          this.editMode = !this.editMode;
        }
      },
      {
        title: "Save Layout",
        icon: "save",
        click: () => {
          this.saveLayout();
        }
      },
      {
        title: "Auto Layout",
        icon: "magic",
        click: async () => {
          await this.getCardLayout(true);
        }
      }
    ];

    this.$store.commit("setMenu", menu);

    this.getCardLayout();
  },
  destroyed() {
    this.$store.commit("clearMenu");
  },
  watch: {
    "$vuetify.breakpoint.name"() {
      this.cardColumnns = [];
      this.getCardLayout();
    }
  },
  methods: {
    async saveLayout() {
      await this.$scrypted.userStorage.setItem(
        this.currentLayoutKey,
        JSON.stringify({
          cardColumns: this.cardColumns,
          cardAlignCenter: this.cardAlignCenter
        })
      );
    },
    moveCard(cardColumn, cardIndex, x, y) {
      try {
        var card = this.cardColumns[cardColumn][cardIndex];
        var newColumn = (cardColumn + x) % this.cardColumns.length;
        var newIndex = (cardIndex + y) % this.cardColumns[newColumn].length;
        this.cardColumns[cardColumn].splice(cardIndex, 1);
        this.cardColumns[newColumn].splice(newIndex, 0, card);
      } catch (e) {
        console.error("error moving card", x, y, e);
      }
    },
    async getCardLayout(auto) {
      if (!auto) {
        try {
          let found = await this.$scrypted.userStorage.getItem(
            `${this.currentLayoutKey}`
          );
          if (found) {
            found = JSON.parse(found);
            if (found.cardColumns) {
              this.cardColumns = found.cardColumns;
              this.cardAlignCenter = !!found.cardAlignCenter;
              return;
            }
          }
        } catch (e) {
          console.error(
            "error restoring card configuration for screen configuration",
            e
          );
        }
      }

      var cards = this.cards;
      const columns = [];

      for (var card of cards) {
        // find teh column with the leeast juink
        if (columns.length < this.columnsForBreakpoint) {
          columns.push([card]);
          continue;
        }

        const least = columns.reduce((a, b) =>
          a.reduce((c, d) => c + d.height, 0) <
          b.reduce((c, d) => c + d.height, 0)
            ? a
            : b
        );
        least.push(card);
      }

      this.cardColumns = columns;
    },
    getColumnsForBreakpoint(bp) {
      switch (bp) {
        case "xl":
          return 4;
        case "lg":
          return 3;
        case "md":
          return 2;
        case "sm":
          return 2;
        case "xs":
          return 1;
      }
      return 1;
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
    cards() {
      return getDefaultDashboard(
        this.$store.state.scrypted.devices,
        this.$scrypted.systemManager
      );
    },
    currentLayoutKey() {
      return `cardColumns-${this.$vuetify.breakpoint.name}`;
    }
  }
};
</script>
