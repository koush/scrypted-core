<template>
  <div>
    <EventPicker
      @input="onChange"
      v-for="(trigger, index) in triggers"
      :key="index"
      :events="events"
      :interfaces="interfaces"
      v-model="triggers[index]"
      style="margin-bottom: 20px;"
    ></EventPicker>

    <v-btn v-on:click.stop.prevent="addTrigger" class="btn btn-secondary mb-3">Add Another Trigger</v-btn>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import EventPicker from "./EventPicker.vue";

export default {
  props: {
    name: String,
    events: Array,
    interfaces: Array,
    value: Array
  },
  data() {
    return {
      triggers: cloneDeep(this.value),
    }
  },
  components: {
    EventPicker
  },
  mounted: function() {
    if (!this.value.length) this.addTrigger();
    this.onChange();
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
    onChange: function() {
      var newValue = this.triggers.slice().filter(e => e.id != "unassigned");
      this.$emit("input", newValue);
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
