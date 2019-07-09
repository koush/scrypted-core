<template>
  <v-layout wrap>
    <v-flex xs12 v-if="name">
      <v-flex xs12 md6 lg6>
        <div v-if="deviceAlerts.length" class="mb-5">
          <v-alert
            dismissible
            @input="removeAlert(alert)"
            v-for="alert in deviceAlerts"
            :key="alert.id"
            xs12
            md6
            lg6
            color="primary"
            dark
            icon="mdi-vuetify"
            border="left"
            prominent
          >
            <template v-slot:prepend>
              <font-awesome-icon
                class="white--text mr-3"
                size="sm"
                :icon="alert.icon"
                color="#a9afbb"
              />
            </template>
            <div class="caption">{{ alert.title }}</div>
            <div>{{alert.message}}</div>
          </v-alert>
        </div>

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
                  <v-select v-if="inferredTypes.length > 1" :items="inferredTypes" label="Type" outlined v-model="type"></v-select>
                  <v-combobox
                    v-if="hasPhysicalLocation(type)"
                    :items="existingRooms"
                    outlined
                    v-model="room"
                    label="Room"
                    required
                  ></v-combobox>
                  <v-checkbox v-if="syncable" v-model="syncWithIntegrations" label="Sync with Integrations"></v-checkbox>
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

    <v-flex xs12 v-if="deviceProps">
      <component
        @refresh="reload"
        @input="onChange"
        :is="deviceProps.box"
        :deviceProps="deviceProps"
        v-model="device"
        :id="id"
        :name="name"
        :type="type"
      ></component>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import Automation from "./automation/Automation.vue";
import Mail from "./mail/Mail.vue";
import Script from "./script/Script.vue";
import ScriptDevice from "./script/ScriptDevice.vue";
import AggregateDevice from "./aggregate/AggregateDevice.vue";
import WebPushRegistration from "./webpush/WebPushRegistration.vue";
import {
  isSyncable,
  inferTypesFromInterfaces,
  getComponentWebPath,
  getDeviceViewPath,
  removeAlert,
  hasPhysicalLocation
} from "./helpers";

export default {
  components: {
    Automation,
    Script,
    ScriptDevice,
    AggregateDevice,
    WebPushRegistration,
    Mail
  },
  data() {
    return this.initialState();
  },
  mounted() {
    if (this.needsLoad) {
      this.reload();
    }
  },
  watch: {
    devices() {
      // console.log('device change detected.');
    },
    id() {
      Object.assign(this.$data, this.initialState());
    },
    needsLoad() {
      if (this.needsLoad) {
        this.reload();
      }
    }
  },
  methods: {
    hasPhysicalLocation,
    getComponentWebPath,
    removeAlert,
    initialState() {
      return {
        showDelete: false,
        showSave: false,
        showSaveError: false,
        deviceProps: undefined,
        name: undefined,
        room: undefined,
        type: undefined,
        device: undefined,
        loading: false,
        syncWithIntegrations: undefined
      };
    },
    onChange() {
      // console.log(JSON.stringify(this.device));
    },
    getMetadata(prop) {
      const metadata = this.$store.state.systemState[this.id].metadata;
      return metadata && metadata.value && metadata.value[prop];
    },
    reload() {
      this.name = this.$store.state.systemState[this.id].name.value;
      this.room = this.$store.state.systemState[this.id].room.value;
      this.type = this.$store.state.systemState[this.id].type.value;
      this.syncWithIntegrations = this.getMetadata("syncWithIntegrations");
      this.device = undefined;
      this.deviceProps = undefined;
      this.loading = true;
      axios.get(`/web/device/${this.id}.json`).then(response => {
        this.deviceProps = response.data;

        this.loading = false;
      });
    },
    remove() {
      this.showDelete = true;
      axios.post(`/web/device/${this.id}/delete`).then(() => {
        delete this.$store.state.systemState[this.id];
        window.location.hash = "#/device";
      });
    },
    save() {
      const post = {
        type: this.type,
        name: this.name,
        room: this.room,
        syncWithIntegrations: this.syncWithIntegrations,
        device: this.device
      };

      this.showSaveError = false;
      this.showSave = false;
      axios
        .post(`/web/device/${this.id}/`, post)
        .then(() => {
          this.showSave = true;
          this.device = undefined;
        })
        .catch(() => (this.showSaveError = true));
    }
  },
  computed: {
    syncable() {
      return isSyncable(this.type);
    },
    inferredTypes() {
      return inferTypesFromInterfaces(this.type, this.$store.state.systemState[this.id].interfaces.value);
    },
    existingRooms() {
      return this.$store.state.scrypted.devices
        .map(device => this.$scrypted.systemManager.getDeviceById(device).room)
        .filter(room => room);
    },
    deviceAlerts() {
      return this.$store.state.scrypted.alerts.filter(alert =>
        alert.path.startsWith("/web" + getDeviceViewPath(this.id))
      );
    },
    devices() {
      return this.$store.state.scrypted.devices;
    },
    id() {
      return this.$route.params.id;
    },
    canLoad() {
      return this.devices.includes(this.id);
    },
    needsLoad() {
      return !this.deviceProps && this.canLoad && !this.loading;
    },
    systemDevice() {
      return this.$scrypted.systemManager.getDeviceById(this.id);
    }
  }
};
</script>