<template>
  <div>
    <EventPicker
      @input="onChange"
      v-for="trigger in keyedTriggers"
      :key="trigger.key"
      :selected="trigger.value"
      :events="events"
      :interfaces="interfaces"
      v-model="trigger.value"
      style="margin-bottom: 20px;"
    ></EventPicker>
    <input type="hidden" ref="jsonData" :name="name" />

    <v-btn v-on:click.stop.prevent="addTrigger" class="btn btn-secondary mb-3">Add Another Trigger</v-btn>
  </div>
</template>

<script>
import EventPicker from "./EventPicker.vue";

export default {
  props: {
    name: String,
    events: Array,
    interfaces: Array,
    value: Array
  },
  components: {
    EventPicker
  },
  mounted: function() {
    if (!this.value.length) this.addTrigger();
    this.updateJson();
  },
  computed: {
    keyedTriggers: function() {
      return this.value.map(trigger => ({
        key: Math.random(),
        value: trigger
      }));
    }
  },
  methods: {
    updateJson: function() {
      this.$refs.jsonData.value = JSON.stringify(
        this.value.slice().filter(e => e.id != "unassigned")
      );
      this.$emit("input", this.value);
    },
    onChange: function() {
      this.updateJson();
    },
    addTrigger: function() {
      this.value.push({
        id: "unassigned",
        condition: null,
        model: {}
      });
    }
  }
};
</script>
