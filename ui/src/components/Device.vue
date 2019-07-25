<template>
  <v-layout wrap>
    <v-flex xs12 md6 v-if="name">
      <v-layout row wrap>
        <v-flex xs12>
          <v-flex>
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
                <div
                  v-linkified:options="{ className: 'alert-link' }"
                  v-html="alert.message"
                  style="color: white;"
                ></div>
              </v-alert>
            </div>

            <v-card raised class="header-card">
              <v-card-title class="orange-gradient subtitle-1 font-weight-light">
                {{name}}
                <v-layout row justify-end align-center>
                  <component
                    :value="deviceState"
                    :device="systemDevice"
                    :is="iface"
                    v-for="iface in cardHeaderInterfaces"
                    :key="iface"
                  ></component>
                </v-layout>
              </v-card-title>

              <v-layout align-center justify-center>
                <component
                  v-for="iface in cardButtonInterfaces"
                  :key="iface"
                  :value="deviceState"
                  :device="systemDevice"
                  :is="iface"
                ></component>
              </v-layout>

              <v-form>
                <v-container>
                  <v-layout>
                    <v-flex xs12>
                      <v-text-field v-model="name" label="Name" required></v-text-field>
                      <v-select
                        v-if="inferredTypes.length > 1"
                        :items="inferredTypes"
                        label="Type"
                        outlined
                        v-model="type"
                      ></v-select>
                      <v-combobox
                        v-if="hasFixedPhysicalLocation(type, deviceState.interfaces)"
                        :items="existingRooms"
                        outlined
                        v-model="room"
                        label="Room"
                        required
                      ></v-combobox>
                      <v-checkbox
                        v-if="syncable"
                        v-model="syncWithIntegrations"
                        label="Sync with Integrations"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>

              <v-card-actions>
                <component
                  v-for="iface in cardActionInterfaces"
                  :key="iface"
                  :value="deviceState"
                  :device="systemDevice"
                  :is="iface"
                ></component>
                <v-spacer></v-spacer>

                <v-btn color="info" text @click="openLogs" v-if="!loading">Logs</v-btn>

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

        <v-flex xs12>
          <component
            v-if="deviceProps"
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
    </v-flex>

    <v-flex xs12 md6 lg6>
      <v-layout row wrap>
        <v-flex xs12 v-for="iface in cardInterfaces" :key="iface">
          <v-flex v-if="name">
            <v-card>
              <v-card-title class="red-gradient white--text subtitle-1 font-weight-light">{{ iface }}</v-card-title>
              <component :value="deviceState" :device="systemDevice" :is="iface"></component>
            </v-card>
          </v-flex>
        </v-flex>

        <v-flex ref="logsEl">
          <LogCard v-if="component && showLogs" :rows="15" :logRoute="`/${component}/${id}/`"></LogCard>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/material.css";

import axios from "axios";
import LogCard from "./builtin/LogCard.vue";
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
  hasFixedPhysicalLocation
} from "./helpers";
import { ScryptedInterface } from "@scrypted/sdk";
import Notifier from "../interfaces/Notifier.vue";
import OnOff from "../interfaces/OnOff.vue";
import Brightness from "../interfaces/Brightness.vue";
import Battery from "../interfaces/Battery.vue";
import Lock from "../interfaces/Lock.vue";
import ColorSettingHsv from "../interfaces/ColorSettingHsv.vue";
import ColorSettingRgb from "../interfaces/ColorSettingRgb.vue";
import OauthClient from "../interfaces/OauthClient.vue";
import Camera from "../interfaces/Camera.vue";
import VideoCamera from "../interfaces/VideoCamera.vue";
import Thermometer from "../interfaces/sensors/Thermometer.vue";
import HumiditySensor from "../interfaces/sensors/HumiditySensor.vue";
import EntrySensor from "../interfaces/sensors/EntrySensor.vue";
import OccupancySensor from "../interfaces/sensors/OccupancySensor.vue";
import Settings from "../interfaces/Settings.vue";
import StartStop from "../interfaces/StartStop.vue";
import Dock from "../interfaces/Dock.vue";
import Pause from "../interfaces/Pause.vue";
import ColorSettingTemperature from "../interfaces/ColorSettingTemperature.vue";
import Entry from "../interfaces/Entry.vue";
import HttpRequestHandler from "../interfaces/HttpRequestHandler.vue";
import PasswordStore from "../interfaces/PasswordStore.vue";
import Scene from "../interfaces/Scene.vue";
import TemperatureSetting from "../interfaces/TemperatureSetting.vue";
import PositionSensor from "../interfaces/sensors/PositionSensor.vue";

const cardHeaderInterfaces = [
  ScryptedInterface.OccupancySensor,
  ScryptedInterface.EntrySensor,
  ScryptedInterface.HumiditySensor,
  ScryptedInterface.Thermometer,
  ScryptedInterface.Battery,
  ScryptedInterface.Lock,
  ScryptedInterface.OnOff
];

const cardInterfaces = [
  ScryptedInterface.Brightness,
  ScryptedInterface.ColorSettingTemperature,
  ScryptedInterface.Notifier,
  ScryptedInterface.ColorSettingHsv,
  ScryptedInterface.ColorSettingRgb,
  ScryptedInterface.Camera,
  ScryptedInterface.VideoCamera,
  ScryptedInterface.TemperatureSetting,
  ScryptedInterface.PasswordStore,
  ScryptedInterface.PositionSensor,
  ScryptedInterface.Settings
];

const cardActionInterfaces = [
  ScryptedInterface.OauthClient,
  ScryptedInterface.HttpRequestHandler
];

const cardButtonInterfaces = [
  ScryptedInterface.Dock,
  ScryptedInterface.Pause,
  ScryptedInterface.StartStop,
  ScryptedInterface.Entry,
  ScryptedInterface.Scene
];

function filterInterfaces(interfaces) {
  return function() {
    if (!this.name) {
      return [];
    }
    return interfaces.filter(iface =>
      this.$store.state.systemState[this.id].interfaces.value.includes(iface)
    );
  };
}

export default {
  components: {
    StartStop,
    Dock,
    Pause,
    Entry,
    Scene,

    Brightness,
    ColorSettingRgb,
    ColorSettingHsv,
    Notifier,
    Camera,
    VideoCamera,
    PasswordStore,
    Settings,
    ColorSettingTemperature,
    TemperatureSetting,
    PositionSensor,

    Lock,
    OnOff,
    Battery,
    Thermometer,
    HumiditySensor,
    EntrySensor,
    OccupancySensor,

    OauthClient,
    HttpRequestHandler,

    VueSlider,
    LogCard,
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
  destroyed() {
    this.cleanupListener();
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
    hasFixedPhysicalLocation,
    getComponentWebPath,
    removeAlert,
    initialState() {
      return {
        showLogs: false,
        showDelete: false,
        showSave: false,
        showSaveError: false,
        deviceProps: undefined,
        name: undefined,
        room: undefined,
        type: undefined,
        device: undefined,
        component: undefined,
        loading: false,
        // deviceState: {},
        syncWithIntegrations: undefined
      };
    },
    escapeHtml(html) {
      return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },
    openLogs() {
      this.showLogs = !this.showLogs;
      if (this.showLogs) {
        this.$vuetify.goTo(this.$refs.logsEl);
      }
    },
    onChange() {
      // console.log(JSON.stringify(this.device));
    },
    cleanupListener() {
      if (this.listener) {
        this.listener.removeListener();
        return;
      }
    },
    getMetadata(prop) {
      const metadata = this.$store.state.systemState[this.id].metadata;
      return metadata && metadata.value && metadata.value[prop];
    },
    reload() {
      // this.deviceState = {};
      // Object.entries(this.$store.state.systemState[this.id]).forEach(
      //   ([key, property]) => (this.deviceState[key] = property.value)
      // );

      this.name = this.$store.state.systemState[this.id].name.value;
      this.room = this.$store.state.systemState[this.id].room.value;
      this.type = this.$store.state.systemState[this.id].type.value;
      this.component = this.$store.state.systemState[this.id].component.value;
      this.syncWithIntegrations = this.getMetadata("syncWithIntegrations");
      this.device = undefined;
      this.deviceProps = undefined;
      this.loading = true;
      axios.get(`/web/device/${this.id}.json`).then(response => {
        this.deviceProps = response.data;

        this.loading = false;

        if (this.systemDevice.interfaces.includes("Refresh")) {
          this.listener = this.systemDevice.listen("Refresh", () => {});
        }
      });
    },
    remove() {
      const id = this.id;
      this.$router.replace("/device");
      axios.post(`/web/device/${id}/delete`);
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
    deviceState() {
      var ret = {};
      Object.entries(this.$store.state.systemState[this.id]).forEach(
        ([key, property]) => (ret[key] = property.value)
      );
      return ret;
    },
    cardButtonInterfaces: filterInterfaces(cardButtonInterfaces),
    cardActionInterfaces: filterInterfaces(cardActionInterfaces),
    cardInterfaces: filterInterfaces(cardInterfaces),
    cardHeaderInterfaces: filterInterfaces(cardHeaderInterfaces),
    syncable() {
      return isSyncable(this.type);
    },
    inferredTypes() {
      return inferTypesFromInterfaces(
        this.type,
        this.$store.state.systemState[this.id].interfaces.value
      );
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
<style>
a.alert-link {
  color: white;
}
</style>
