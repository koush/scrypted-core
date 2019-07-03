<template>
  <v-card>
    <v-card-title class="small-header red-gradient white--text font-weight-light subtitle-2">Trigger</v-card-title>
    <v-form>
      <v-container>
        <v-layout>
          <v-flex xs12>
            <Select2
              v-model="selected"
              :options="events"
              :unselected="unselected"
              @change="onChange"
              label="Event"
            ></Select2>
            <component
              v-if="selected.component && selected.properties && selected.properties.event"
              :key="value.id"
              :is="selected.component"
              v-model="value.model"
              :events="events"
              :interfaces="interfaces"
              @input="onChange"
            ></component>
            <v-text-field
              label="Trigger Condition (optional)"
              v-model="value.condition"
              persistent-hint
              hint="OnOff example: eventData === true"
              @input="onChange"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import cloneDeep from "lodash.clonedeep";

import Select2 from "./Select2.vue";
import Scheduler from "../interfaces/automation/Scheduler.vue";

function unassigned() {
  return {
    id: "unassigned",
    text: "Select Event Trigger",
    component: "Unassigned",
    model: {}
  };
}

export default {
  props: {
    value: Object,
    events: Array,
    interfaces: Array,
    unselected: {
      type: Object,
      default: unassigned
    }
  },
  data() {
    let selected =
      this.value.id == "unassigned"
        ? unassigned()
        : this.events.find(e => e.id == this.value.id);
    selected = cloneDeep(selected);
    const condition = this.value.condition;
    return {
      selected,
      condition,
      model: cloneDeep(this.value.model),
    };
  },
  mounted: function() {
    if (!this.selected) {
      this.selected = unassigned();
      this.onChange();
    }
  },
  components: {
    Select2,
    Scheduler
  },
  methods: {
    onChange: function() {
      this.$emit("input", this.value);
    }
  }
};
</script>
