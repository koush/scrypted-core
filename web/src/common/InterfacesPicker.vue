<template>
  <div>
    <InterfacePicker
      @input="onChange"
      v-for="(action, index) in outputActions"
      :key="index"
      :interfaces="interfaces"
      v-model="outputActions[index]"
      style="margin-bottom: 20px;"
    ></InterfacePicker>

    <v-btn v-on:click.stop.prevent="addAction" class="btn btn-secondary mb-3">Add Another Action</v-btn>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import InterfacePicker from "./InterfacePicker.vue";

export default {
  props: {
    name: String,
    interfaces: Array,
    value: Array
  },
  data() {
    return {
      outputActions: cloneDeep(this.value)
    };
  },
  components: {
    InterfacePicker
  },
  mounted: function() {
    if (!this.value.length) {
      this.addAction();
    }
    this.onChange();
  },
  methods: {
    onChange: function() {
      var newValue = this.outputActions
        .slice()
        .filter(e => e.id != "unassigned");
      this.$emit("input", newValue);
    },
    addAction: function() {
      // this object will hold the final interface id and model.
      // it starts out unassigned.
      this.outputActions.push({
        // unique per interfaces array
        id: "unassigned",
        model: {}
      });
      this.onChange();
    }
  }
};
</script>
