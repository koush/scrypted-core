<template>
  <v-flex xs12>
    <v-layout>
      <v-text-field
        xs6
        md6
        outlined
        v-model="lazyValue.variableName"
        placeholder="variableName"
        label="Variable Name"
        @input="onInput"
      ></v-text-field>
      <Select2
        xs6
        md6
        label="Variable"
        v-model="lazyValue.variableValue"
        :options="combinedActions"
        :unselected="unselected"
        @input="onInput"
      ></Select2>
    </v-layout>
  </v-flex>
</template>

<script>
import Select2 from "../../common/Select2.vue";
import Vue from "vue";
import CustomValue from "../../common/CustomValue.vue";

function unassigned() {
  return {
    id: "unassigned",
    text: "Assign Device to Variable"
  };
}

export default {
  mixins: [CustomValue],
  props: {
    scriptType: String,
    actions: Array,
    unselected: {
      type: Object,
      default: unassigned
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
    }
  },
  components: {
    Select2
  },
  methods: {
    createLazyValue() {
      return {
        variableName: this.value.key,
        variableValue:
          Vue.util.extend(this.actions.find(e => e.id == this.value.value)) ||
          unassigned()
      };
    },
    createInputValue() {
      return {
        key: this.lazyValue.variableName,
        value: this.lazyValue.variableValue.id
      };
    }
  }
};
</script>
