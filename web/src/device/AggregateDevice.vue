<template>
  <v-flex xs12 md6 lg6>
    <v-flex>
      <v-card raised class="header-card" style="margin-bottom: 60px">
        <v-card-title
          class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
        >
          <font-awesome-icon size="sm" icon="folder-plus" />
          <span class="title font-weight-light">&nbsp;&nbsp;Grouped Devices</span>
        </v-card-title>
        <div class="header-card-spacer"></div>
        <v-form>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <InterfaceMultiselect @input="onChange" v-model="device.deviceInterfaces" :devices="value.allDevices" name="Interfaces"></InterfaceMultiselect>
                <InterfaceMultiselect @input="onChange" v-model="device.deviceEvents" :devices="value.allDevices" name="Events"></InterfaceMultiselect>

              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>
  </v-flex>
</template>
<script>
import Vue from "vue";

import InterfaceMultiselect from "./InterfaceMultiselect.vue";

export default {
  props: ["value", "id", "name"],
  components: {
    InterfaceMultiselect,
  },
  data: function() {
    return {
      device: {
        deviceInterfaces: Vue.util.extend(this.value.selectedInterfaces),
        deviceEvents: Vue.util.extend(this.value.selectedEvents),
      }
    };
  },
  methods: {
    onChange() {
      this.$emit("input", this.device);
    }
  },
  computed: {
    mappedInterfaces: {
      get: function() {
        return this.mapThem();
      }
    }
  }
};
</script>