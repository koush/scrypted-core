<template>
  <v-card style="margin-bottom: 16px;">
    <v-card-title class="small-header red-gradient white--text font-weight-light subtitle-2">Action</v-card-title>
    <v-form>
      <v-container>
        <v-layout>
          <v-flex xs12>
            <Select2
              v-model="lazyValue.selected"
              :options="actionableInterfaces"
              :unselected="unselected"
              @input="onInput"
            ></Select2>

            <component
              :is="lazyValue.selected.component"
              :properties="lazyValue.selected.properties"
              v-model="lazyValue.model"
              @input="onInput"
            ></component>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import CustomValue from "./CustomValue.vue";

import Unassigned from "./../interfaces/Unassigned.vue";

import Condition from "../interfaces/automation/Condition.vue";
import Timer from "../interfaces/automation/Timer.vue";
import Javascript from "../interfaces/automation/Javascript.vue";

import EventListener from "../interfaces/EventListener.vue";
import OnOff from "../interfaces/OnOff.vue";
import Lock from "../interfaces/Lock.vue";
import Notifier from "../interfaces/Notifier.vue";
import SoftwareUpdate from "../interfaces/SoftwareUpdate.vue";

import Select2 from "./Select2.vue";
function unassigned() {
  return {
    id: "unassigned",
    text: "Select Action",
    component: "Unassigned"
  };
}

export default {
  props: {
    name: String,
    interfaces: Array,
    unselected: {
      type: Object,
      default: unassigned
    }
  },
  mixins: [CustomValue],
  computed: {
    actionableInterfaces() {
      return this.interfaces.filter(iface => iface.action);
    }
  },
  components: {
    Unassigned,
    CustomValue,

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
  watch: {
    'lazyValue.selected.component'() {
      this.lazyValue.model = {};
    }
  },
  methods: {
    createLazyValue() {
      let selected =
        (this.value.id == "unassigned"
          ? unassigned()
          : this.interfaces.find(e => e.id == this.value.id)) || unassigned();
      selected = cloneDeep(selected) || unassigned();
      return {
        selected,
        model: cloneDeep(this.value.model)
      };
    },
    createInputValue() {
      return {
        id: this.lazyValue.selected.id,
        model: this.lazyValue.model,
      }
    }
  }
};
</script>
