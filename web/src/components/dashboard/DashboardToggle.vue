<template>
  <v-list-item ripple @click="showDevices(type)">
    <v-list-item-icon>
      <font-awesome-icon
        size="sm"
        :icon="typeToIcon(type.type)"
        :color="on ? 'orange' : '#a9afbb'"
      />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title class="font-weight-light">{{ groupName }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <v-switch color="indigo" inset v-model="on" @click.stop></v-switch>
    </v-list-item-action>

    <v-overlay :value="showLightsDialog" color="blue" opacity=".8">
      <v-container fluid>
        <v-card v-click-outside="maybeHideDialog" dark color="green" raised>
          <v-card-title>
            <font-awesome-icon
              size="sm"
              :icon="typeToIcon(type.type)"
              color="white"
              style="margin-right: 20px"
            />
            <span class="title font-weight-light">{{ group + ' ' + pluralize(type.type) }}</span>
          </v-card-title>

          <v-flex xs12>
            <v-layout align-center justify-center column>
              <div v-if="brightness !== undefined">
                <div class="slider-pad-bottom"></div>
                <vue-slider
                  :width="40"
                  :height="200"
                  ref="slider"
                  direction="btt"
                  :dotSize="60"
                  v-model="brightness"
                ></vue-slider>
                <div class="slider-pad-bottom"></div>
              </div>
              <v-list color="green">
                <DashboardPopupToggle
                  :light="true"
                  v-for="deviceId in type.ids"
                  :key="deviceId"
                  :type="type.type"
                  :ids="[deviceId]"
                  :name="$store.state.systemState[deviceId].name.value"
                ></DashboardPopupToggle>
              </v-list>
              <v-btn rounded color="primary" dark x-small>Rounded Button</v-btn>
            </v-layout>
          </v-flex>
        </v-card>
      </v-container>
    </v-overlay>
  </v-list-item>
</template>
<script lang="ts">
import DashboardBase from "./DashboardBase.vue";
import DashboardPopupToggle from "./DashboardPopupToggle.vue";
import ClickOutside from "vue-click-outside";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/material.css";
import { ScryptedInterface } from "@scrypted/sdk";
import throttle from "lodash.throttle";

export default {
  props: ["type", "group"],
  mixins: [DashboardBase],
  components: {
    VueSlider,
    DashboardPopupToggle
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      showLightsDialog: false,
      watchClickOutside: false,
    };
  },
  methods: {
    maybeHideDialog() {
      if (this.showLightsDialog && this.watchClickOutside) {
        this.showLightsDialog = false;
      }
    },
    showDevices(type) {
      if (this.showLightsDialog || type.type != "Light") {
        return;
      }
      this.showLightsDialog = true;
      this.watchClickOutside = false;
      setTimeout(() => {
        this.watchClickOutside = true;
      }, 1000);
    },
    debounceSetBrightness: throttle(function(self) {
      self.type.ids
        .map(id => self.getDevice(id))
        .filter(device =>
          device.interfaces.includes(ScryptedInterface.Brightness)
        )
        .forEach(device => device.setBrightness(self._debouncedBrightness));
    }, 500)
  },
  computed: {
    brightness: {
      get() {
        const brightnessDevices = this.type.ids
          .map(id => this.getDevice(id))
          .filter(device =>
            device.interfaces.includes(ScryptedInterface.Brightness)
          );
        if (!brightnessDevices.length) {
          return undefined;
        }
        const brightness = brightnessDevices.reduce(
          (brightness, device) => brightness + device.brightness,
          0
        );
        return brightness / brightnessDevices.length;
      },
      set(value) {
        this._debouncedBrightness = value;
        this.debounceSetBrightness(this);
      }
    },
    groupName() {
      if (this.type.name) {
        return this.type.name;
      }
      return this.pluralize(this.type.type);
    },
    on: {
      get() {
        return this.type.ids
          .map(id => this.getDevice(id))
          .reduce((on, device) => on || device.on, false);
      },
      set(value) {
        this.type.ids
          .map(id => this.getDevice(id))
          .forEach(device => device[value ? "turnOn" : "turnOff"]());
      }
    }
  }
};
</script>
<style>
.slider-pad-bottom {
  margin-bottom: 40px;
}
</style>