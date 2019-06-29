<template>
  <v-list-item ripple @click="showDevices(type)">
    <v-list-item-icon>
      <font-awesome-icon size="sm" :icon="typeToIcon(type.type)" :color="on ? 'orange' : '#a9afbb'"/>
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
              <div class="slider-pad-bottom"></div>
              <vue-slider :width="40" :height="200" ref="slider" direction="btt" :dotSize="60"></vue-slider>
              <div class="slider-pad-bottom"></div>
              <v-list color="green">
                <SingleToggle v-for="deviceId in type.ids" :key="deviceId" :type="type.type" :ids="[deviceId]" :name="$store.state.systemState[deviceId].name.value"></SingleToggle>
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
import Base from "./Base.vue";
import SingleToggle from "./SingleToggle.vue";
import ClickOutside from "vue-click-outside";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/material.css";


export default {
  props: ["type", "group"],
  mixins: [Base],
  components: {
    VueSlider,
    SingleToggle
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      showLightsDialog: false,
      watchClickOutside: false
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
    }
  },
  computed: {
    groupName() {
      if (this.type.name) {
        return this.type.name;
      }
      return this.pluralize(this.type.type);
    },
    on: {
      get() {
        var on = false;
        this.type.ids.forEach(
          id => (on = on || this.$store.state.systemState[id].on.value)
        );
        return on;
      },
      set(value) {
        this.type.ids.forEach(id => this.setOnOff(id, value));
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