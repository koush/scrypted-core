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
              @input="onChange"
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
import Select2 from "./Select2.vue";

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
  mounted: function() {
    if (!this.selected) {
      this.selected = unassigned();
      this.onChange();
    }
  },
  computed: {
    selected: {
      get: function() {
        if (this.value.id == "unassigned") return unassigned();
        return this.events.find(e => e.id == this.value.id);
      },
      set: function(val) {
        this.value.condition = null;
        this.value.id = val.id;
        this.value.model = {};
      }
    }
  },
  components: {
    Select2
  },
  methods: {
    onChange: function() {
      this.$emit("input", this.value);
    }
  }
};
</script>
