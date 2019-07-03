<template>
  <div>
    <InterfacePicker
      @input="onChange"
      v-for="action in keyedActions"
      :key="action.key"
      :interfaces="interfaces"
      v-model="action.value"
      style="margin-bottom: 20px;"
    ></InterfacePicker>
    <input type="hidden" ref="jsonData" :name="name" />

    <v-btn v-on:click.stop.prevent="addAction" class="btn btn-secondary mb-3">Add Another Action</v-btn>
  </div>
</template>

<script>
import InterfacePicker from "./InterfacePicker.vue";
export default {
  props: {
    name: String,
    interfaces: Array,
    value: Array
  },
  components: {
    InterfacePicker
  },
  mounted: function() {
    if (!this.value.length) this.addAction();
    this.updateJson();
  },
  computed: {
    keyedActions: function() {
      return this.value.map(action => ({ key: Math.random(), value: action }));
    }
  },
  methods: {
    updateJson: function() {
      var newValue = this.value
        .slice()
        .filter(e => e.id != "unassigned");
      this.$refs.jsonData.value = JSON.stringify(newValue);
      this.$emit("input", newValue);
    },
    onChange: function() {
      this.updateJson();
    },
    addAction: function() {
      // this object will hold the final interface id and model.
      // it starts out unassigned.
      this.value.push({
        // unique per interfaces array
        id: "unassigned",
        model: {}
      });
    }
  }
};
</script>
