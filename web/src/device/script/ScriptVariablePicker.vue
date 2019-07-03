<template>
  <v-layout row>
    <v-text-field
      xs12
      md6
      outlined
      v-model="variableName"
      placeholder="variableName"
      label="Variable Name"
      @input="onChange"
    ></v-text-field>
    <Select2
      xs12
      md6
      label="Variable"
      v-model="variableValue"
      :options="combinedActions"
      :unselected="unselected"
      @input="onChange"
    ></Select2>
  </v-layout>
</template>

<script>
import Select2 from "../../common/Select2.vue";
import Vue from 'vue';

function unassigned() {
  return {
    id: "unassigned",
    text: "Assign Device to Variable"
  };
}

export default {
  props: {
    value: Object,
    scriptType: String,
    actions: Array,
    unselected: {
      type: Object,
      default: unassigned
    }
  },
  data() {
    return {
      variableName: this.value.key,
      variableValue: Vue.util.extend(this.actions.find(e => e.id == this.value.value)) || unassigned(),
    }
  },
  computed: {
    combinedActions: {
      get: function() {
        var actions = [];
        if (this.scriptType == "Library") {
          actions.push({
            id: "library",
            text: "Library Method Parameter"
          });
        }
        actions = actions.concat(this.actions);
        return actions;
      }
    },
    selected: {
      get: function() {
        if (this.value.value == "unassigned") return unassigned();
        return this.actions.find(e => e.id == this.value.value);
      },
      set: function(val) {
        this.value.value = val.id;
      }
    }
  },
  components: {
    Select2
  },
  methods: {
    onChange: function() {
      this.$emit("input", {
        key: this.variableName,
        value: this.variableValue.id,
      });
    }
  }
};
</script>
