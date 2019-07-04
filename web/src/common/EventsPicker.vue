<template>
  <Grower
    v-model="lazyValue"
    :component="EventPicker"
    :empty="unassigned"
    @input="onInput"
    :componentProps="componentProps"
  ></Grower>
</template>

<script>
import EventPicker from "./EventPicker.vue";
import CustomValue from "./CustomValue.vue";
import Grower from "./Grower";

export default {
  props: {
    name: String,
    events: Array,
    interfaces: Array,
  },
  mixins: [CustomValue],
  components: {
    Grower,
  },
  computed: {
    EventPicker() {
      return EventPicker;
    },
    componentProps() {
      return {
        events: this.events,
        interfaces: this.interfaces,
      };
    },
    unassigned() {
      return {
        id: "unassigned",
        condition: null,
        model: {}
      };
    }
  },
};
</script>
