<template>
  <v-flex>
    <v-dialog v-model="restart" width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="red" dark v-on="on">Restart Scrypted</v-btn>
      </template>

      <v-card color="red" dark>
        <v-card-title primary-title>Restart Scrypted</v-card-title>

        <v-card-text>Are you sure you want to restart the Scrypted service?</v-card-text>

        <v-card-text>{{ restartStatus }}</v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="restart = false">Cancel</v-btn>
          <v-btn text @click="doRestart">Restart</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>
<script>
import { getComponentWebPath } from "../helpers";
import axios from "axios";

export default {
  data() {
    return {
      restart: false,
      restartStatus: undefined
    };
  },
  computed: {
    componentWebPath() {
      return getComponentWebPath("settings");
    }
  },
  methods: {
    getComponentWebPath,
    doRestart() {
      this.restartStatus = "Restarting...";
      axios.post(`${this.componentWebPath}/restart`);
    }
  }
};
</script>
