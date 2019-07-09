<template>
  <v-layout wrap>
    <v-flex xs12 md6 lg6 v-if="!loading">
      <v-flex>
        <v-card raised class="header-card">
          <v-card-title
            class="orange-gradient subtitle-1 text--white header-card-gradient font-weight-light"
          >Remote Management</v-card-title>
          <div class="header-card-spacer"></div>

          <v-card-text v-if="settings.loginEmail">Use your {{ settings.loginType }} log in to manage Scrypted from anywhere.</v-card-text>
          <v-card-text v-else>Log in with Google or Amazon to manage Scrypted from anywhere.</v-card-text>
          <v-card-text>Remote Management must be enabled for Google Home and Amazon Alexa integrations.</v-card-text>
          <v-card-text v-if="settings.loginEmail && settings.environment">
            You can remotely log in to Scrypted using your login account, {{ settings.loginEmail }}, at this address:
            <a
              :href="`https://${settings.environment}`"
            >{{ `https://${settings.environment}` }}</a>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="orange"
              v-if="settings.environment"
              @click="login"
            >{{ settings.loginEmail ? 'Update Login' : 'Login' }}</v-btn>
            <v-btn outlined color="orange" @click="disable" v-if="settings.environment">Disable</v-btn>
            <v-btn outlined color="orange" @click="enable" v-if="!settings.environment">Enable</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import qs from "query-string";
import { getComponentWebPath } from "../helpers";

export default {
  data() {
    return {
      loading: true,
      settings: {}
    };
  },
  computed: {
    componentWebPath() {
      return getComponentWebPath("remote");
    }
  },
  methods: {
    refresh() {
      axios.get(`${this.componentWebPath}/settings`).then(response => {
        this.$data.settings = response.data;
        this.loading = false;
      });
    },
    login() {
      window.location = this.settings.loginLink;
    },
    disable() {
      axios
        .post(
          `${this.componentWebPath}/`,
          qs.stringify({
            environment: ""
          })
        )
        .then(() => this.refresh());
    },
    enable() {
      axios
        .post(
          `${this.componentWebPath}/`,
          qs.stringify({
            environment: "home.scrypted.app"
          })
        )
        .then(() => this.refresh());
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>