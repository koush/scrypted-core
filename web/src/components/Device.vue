<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-flex xs12 md6 lg6>
        <v-card raised class="header-card">
          <v-card-title
            class="orange-gradient subtitle-1 text--white header-card-gradient font-weight-light"
          >{{name}}</v-card-title>
          <div class="header-card-spacer"></div>

          <v-form>
            <v-container>
              <v-layout>
                <v-flex xs12>
                  <v-text-field :value="name" label="Name" required></v-text-field>
                  <v-select :items="[type]" label="Type" outlined :value="type"></v-select>
                  <v-checkbox v-model="syncWithIntegrations" label="Sync with Integrations"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" v-if="!loading" text>Delete</v-btn>
            <v-btn color="primary" v-if="!loading" text>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-flex>

    <v-flex xs12 v-if="!loading">
      <component :is="device.box" :value="device.automationData"></component>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import Automation from "../device/Automation";

export default {
  components: {
    Automation
  },
  data() {
    return {
      device: {},
      loading: true
    };
  },
  created() {
    axios.get(`/web/device/${this.id}.json`).then(response => {
      this.device = response.data;
      this.loading = false;
    });
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    name() {
      return this.$store.state.systemState[this.id].name.value;
    },
    type() {
      return this.$store.state.systemState[this.id].type.value;
    },
    syncWithIntegrations: {
      get() {
        return this.$store.state.systemState[this.id].metadata.value
          .syncWithIntegrations;
      },
      set() {}
    }
  }
};
</script>