<template>
  <v-layout>
    <v-flex xs12 md6 lg4>
      <v-flex>
        <v-btn color="primary" @click="goLegacy" outlined dark block>Legacy Management Console</v-btn>
      </v-flex>

      <v-flex>
        <form method="POST" action="/web/component/settings/backup">
          <v-btn color="green" type="submit" outlined dark block>Download Backup</v-btn>
        </form>
      </v-flex>

      <v-flex>
        <input type="file" name="file" hidden ref="restoreInput" @change="doRestore" />
        <v-btn color="blue" outlined dark block @click="restore">Restore Backup</v-btn>
      </v-flex>

      <v-dialog v-model="restart" width="500">
        <template v-slot:activator="{ on }">
          <v-flex>
            <v-btn block color="red" dark v-on="on">Restart Scrypted</v-btn>
          </v-flex>
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
  </v-layout>
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
    goLegacy() {
      window.open("/web/dashboard");
    },
    doRestart() {
      this.restartStatus = "Restarting...";
      axios.post(`${this.componentWebPath}/restart`);
    },
    restore() {
      this.$refs.restoreInput.click();
    },
    doRestore() {
      let formData = new FormData();
      formData.append("file", this.$refs.restoreInput.files[0]);
      axios
        .post("/web/component/settings/restore", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function() {})
        .catch(function() {});
    }
  }
};
</script>
