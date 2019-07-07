<template>
  <v-layout wrap>
    <v-flex v-for="(card, cardIndex) in cards" :key="cardIndex" xs12 md6 lg4>
      <v-flex>
        <v-card v-if="!card.hide" raised class="header-card">
          <v-card-title
            class="orange-gradient subtitle-1 text--white header-card-gradient font-weight-light"
          >{{ card.title }}</v-card-title>
          <div class="header-card-spacer"></div>

          <v-card-text>{{ card.description }}</v-card-text>
          <component v-if="card.body" :is="card.body" v-model="card.value"></component>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="orange"
              v-for="(cardButton, buttonIndex) in card.buttons"
              :key="buttonIndex"
              @click="cardButton.click && cardButton.click(card.value)"
            >{{ cardButton.title }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-flex>
    <v-flex xs12>
      <v-flex xs12 md6 lg8>
        <v-flex v-for="deviceGroup in deviceGroups" :key="deviceGroup.name">
          <v-card raised class="header-card">
            <v-card-title
              class="red-gradient subtitle-1 text--white header-card-gradient font-weight-light"
            >{{ deviceGroup.name }}</v-card-title>
            <div class="header-card-spacer"></div>
            <DeviceTable :deviceGroup="deviceGroup" :getOwnerColumn="getOwnerColumn" :getOwnerLink="getOwnerLink"></DeviceTable>
          </v-card>
        </v-flex>
      </v-flex>
    </v-flex>
  </v-layout>
</template>
<script>
import { typeToIcon, getComponentWebPath } from "../helpers";
import DeviceTable from "../../common/DeviceTable.vue";

export default {
  components: {
    DeviceTable
  },
  methods: {
    typeToIcon,
    getOwnerColumn() {
      return null;
    },
    getOwnerLink() {
      return null;
    },
  },
  computed: {
    componentWebPath() {
      return getComponentWebPath(this.id);
    },
    id() {
      return window.location.hash.replace('#/component/', '');
    },
    deviceGroups() {
      const ids = this.$store.state.scrypted.devices;
      const devices = ids
        .map(id => this.$scrypted.systemManager.getDeviceById(id))
        .filter(
          device => device && device.component && device.component === this.component.id && !device.owner
        )
        .map(device => ({
          id: device.id,
          name: device.name,
          type: device.type
        }));
      return [
        {
          // pluralize
          ownerColumn: null,
          name: this.component.name,
          devices
        }
      ];
    }
  }
};
</script>