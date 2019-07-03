<template>
  <v-card>
    <v-card-title class="small-header red-gradient white--text font-weight-light subtitle-2">Action</v-card-title>
    <v-form>
      <v-container>
        <v-layout>
          <v-flex xs12>
            <Select2
              v-model="selected"
              :options="actionableInterfaces"
              :unselected="unselected"
              @input="onChange"
            ></Select2>

            <component
              :is="selected.component"
              :properties="selected.properties"
              v-model="model"
              @input="onChange"
            ></component>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import cloneDeep from "lodash.clonedeep";

import Unassigned from './../interfaces/Unassigned.vue'

import Condition from '../interfaces/automation/Condition.vue';
import Timer from '../interfaces/automation/Timer.vue';
import Javascript from '../interfaces/automation/Javascript.vue';

import EventListener from '../interfaces/EventListener.vue';
import OnOff from '../interfaces/OnOff.vue';
import Lock from '../interfaces/Lock.vue';
import Notifier from '../interfaces/Notifier.vue';
import SoftwareUpdate from '../interfaces/SoftwareUpdate.vue';


import Select2 from "./Select2.vue";
function unassigned() {
  return {
    id: "unassigned",
    text: "Select Action",
    component: "Unassigned",
  };
}

export default {

  props: {
    name: String,
    value: Object,
    interfaces: Array,
    unselected: {
      type: Object,
      default: unassigned
    }
  },
  data() {
    let selected = this.value.id == "unassigned" ? unassigned() : this.interfaces.find(e => e.id == this.value.id);
    selected = cloneDeep(selected) || unassigned();
    return {
      selected,
      model: cloneDeep(this.value.model),
    };
  },
  mounted: function() {
    if (!this.selected) {
      this.selected = unassigned();
      this.onChange();
    }
  },
  computed: {
    actionableInterfaces: {
      get: function() {
        return this.interfaces.filter(iface => iface.action);
      }
    },
  },
  components: {
    Unassigned,

    Condition,
    Timer,
    Javascript,

    EventListener,
    OnOff,
    Lock,
    Notifier,
    SoftwareUpdate,

    Select2
  },
  methods: {
    onChange: function() {
      this.$emit("input", {
        id: this.selected.id,
        model: this.model,
      });
    }
  }
};
</script>
