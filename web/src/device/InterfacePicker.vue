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
              :key="value.id"
              :is="selected.component"
              :properties="selected.properties"
              v-model="value.model"
              @input="onChange"
            ></component>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>

import Condition from '../interfaces/automation/Condition.vue';
import Timer from '../interfaces/automation/Timer.vue';

import OnOff from '../interfaces/OnOff.vue';


import Select2 from "./Select2.vue";
function unassigned() {
  return {
    id: "unassigned",
    text: "Select Action",
    component: "Unassigned",
    model: {}
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
    selected: {
      get: function() {
        if (this.value.id == "unassigned") return unassigned();
        return this.interfaces.find(e => e.id == this.value.id);
      },
      set: function(val) {
        this.value.model = {};
        this.value.id = val.id;
      }
    }
  },
  components: {
    Condition,
    
    OnOff,
    Timer,

    Select2
  },
  methods: {
    onChange: function() {
      this.$emit("input", this.value);
    }
  }
};
</script>
