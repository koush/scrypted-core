<template>
  <v-layout wrap>
    <v-flex v-for="(card, cardIndex) in cards" :key="cardIndex" xs12 md6 lg4>
      <v-flex>
        <v-card raised class="header-card">
          <v-card-title
            class="orange-gradient subtitle-1 text--white header-card-gradient font-weight-light"
          >{{ card.title }}</v-card-title>
          <div class="header-card-spacer"></div>

          <v-card-text>{{ card.description }}</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="orange"
              v-for="(cardButton, buttonIndex) in card.buttons"
              :key="buttonIndex"
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
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-xs-left"></th>
                  <th class="text-xs-left">Name</th>
                  <th
                    v-if="deviceGroup.ownerColumn"
                    class="text-xs-left"
                  >{{ deviceGroup.ownerColumn }}</th>
                  <th class="text-xs-left">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="device in deviceGroup.devices" :key="device.id">
                  <td>
                    <font-awesome-icon size="sm" :icon="typeToIcon(device.type)" color="#a9afbb" />
                  </td>
                  <td class="body-2 font-weight-light">
                    <a link :href="'#/device/' + device.id">{{ device.name }}</a>
                  </td>
                  <td
                    v-if="deviceGroup.ownerColumn"
                    class="body-2 font-weight-light"
                  >{{ getOwnerColumn(device) }}</td>
                  <td class="body-2 font-weight-light">{{ device.type }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-flex>
      </v-flex>
    </v-flex>
  </v-layout>
</template>
<script>
import { typeToIcon } from "../helpers";

export default {
  props: ["id", "index"],
  methods: {
    typeToIcon,
    getOwnerColumn() {
      return null;
    }
  },
  computed: {
    deviceGroups() {
      const ids = Object.keys(this.$store.state.systemState);
      const devices = ids
        .map(id => this.$scrypted.systemManager.getDeviceById(id))
        .filter(
          device => device.component === this.component.id && !device.owner
        )
        .map(device => ({
          id: device.id,
          name: this.$store.state.systemState[device.id].name.value,
          type: this.$store.state.systemState[device.id].type.value
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