<template>
  <div>
    <v-flex>
      <ScriptVariablePicker
        v-for="(value, key) in vars"
        v-model="vars[key]"
        :key="key"
        :selected="value"
        :actions="actions"
        :scriptType="scriptType"
        @input="onChange"
      ></ScriptVariablePicker>
    </v-flex>
    <v-tooltip bottom v-if="addButton" >
      <template v-slot:activator="{ on }">
        <v-btn v-on:click.stop.prevent="addVariable" color="info" outlined v-on="on">Add Variable</v-btn>
      </template>
      <span>Assign a device to a variable to use it within the script.</span>
    </v-tooltip>
  </div>
</template>

<script>
import ScriptVariablePicker from "./ScriptVariablePicker.vue";
import Vue from 'vue';

export default {
  props: ["addButton", "value", "actions", "scriptType"],
  data() {
    return {
      vars: Vue.util.extend(this.value.vars),
    }
  },
  components: {
    ScriptVariablePicker
  },
  computed: {
    keyedVars: function() {
      return this.value.vars.map(v => ({ key: Math.random(), value: v }));
    }
  },
  mounted: function() {
    if (!this.value.vars.length) {
      this.addVariable();
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.value);
    },
    addVariable() {
      this.value.vars.push({
        key: "",
        value: "unassigned"
      });
    }
  }
};
</script>
