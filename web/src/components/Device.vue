<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-flex xs12 md6 lg6>
        <v-card raised class="header-card">
          <v-card-title
            class="orange-gradient subtitle-1 header-card-gradient font-weight-light"
          >{{name}}</v-card-title>
          <div class="header-card-spacer"></div>

          <v-form>
            <v-container>
              <v-layout>
                <v-flex xs12>
                  <v-text-field v-model="name" label="Name" required></v-text-field>
                  <v-select :items="[type]" label="Type" outlined v-model="type"></v-select>
                  <v-checkbox v-model="syncWithIntegrations" label="Sync with Integrations"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-dialog v-model="showDelete" width="500">
              <template v-slot:activator="{ on }">
                <v-btn color="error" v-if="!loading" text v-on="on">Delete</v-btn>
              </template>

              <v-card>
                <v-card-title
                  style="margin-bottom: 8px;"
                  class="red font-weight-light white--text"
                  primary-title
                >Delete Device</v-card-title>

                <v-card-text>This will permanently delete the device. It can not be undone.</v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="showDelete = false">Cancel</v-btn>
                  <v-btn color="red" text @click="remove">Delete Device</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="primary" v-if="!loading" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert
          outlined
          v-model="showSave"
          dismissible
          close-text="Close Alert"
          type="success"
        >Saved.</v-alert>
        <v-alert
          outlined
          v-model="showSaveError"
          dismissible
          close-text="Close Alert"
          type="success"
        >There was an error while saving. Please check the logs.</v-alert>
      </v-flex>
    </v-flex>

    <v-flex xs12 v-if="!loading">
      <component
        @input="onChange"
        :is="deviceProps.box"
        :deviceProps="deviceProps"
        v-model="device"
        :id="id"
        :name="name"
        :type="type"
        :componentWebPath="componentWebPath"
      ></component>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import Automation from "../device/Automation.vue";
import Script from "../device/Script.vue";
import ScriptDevice from "../device/ScriptDevice.vue";
import AggregateDevice from "../device/AggregateDevice.vue";
import WebPushRegistration from "../device/WebPushRegistration.vue";

export default {
  components: {
    Automation,
    Script,
    ScriptDevice,
    AggregateDevice,
    WebPushRegistration
  },
  data() {
    return {
      showDelete: false,
      showSave: false,
      showSaveError: false,
      deviceProps: {},
      device: undefined,
      loading: true,
      name: undefined,
      type: undefined,
      syncWithIntegrations: undefined
    };
  },
  created() {
    this.reload();
  },
  watch: {
    id() {
      this.reload();
    }
  },
  methods: {
    onChange() {
      // console.log(JSON.stringify(this.device));
    },
    reload() {
      this.name = this.$store.state.systemState[this.id].name.value;
      this.type = this.$store.state.systemState[this.id].type.value;
      this.syncWithIntegrations = this.$store.state.systemState[
        this.id
      ].metadata.value.syncWithIntegrations;
      this.device = undefined;
      this.deviceProps = {};
      this.loading = true;
      axios.get(`/web/device/${this.id}.json`).then(response => {
        this.deviceProps = response.data;

        this.loading = false;
      });
    },
    remove() {
      // this.showDelete = true;
      // axios
      //   .delete(`/web/device/${this.id}/`)
      //   .then(e => (window.location.hash = "#/device"));
    },
    save() {
      const post = {
        type: this.type,
        name: this.name,
        syncWithIntegrations: this.syncWithIntegrations,
        device: this.device
      };

      this.showSaveError = false;
      this.showSave = false;
      axios
        .post(`/web/device/${this.id}/`, post)
        .then(() => (this.showSave = true))
        .catch(() => (this.showSaveError = true));
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    componentWebPath() {
      return `/web/component/${this.$store.state.systemState[this.id].component.value}`;
    }
  }
};
</script>