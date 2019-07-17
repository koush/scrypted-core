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
import CustomValue from "../../common/CustomValue.vue";
import Grower from "../../common/Grower.vue";

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
  methods: {
    createInputValue() {
      return this.lazyValue.slice().filter(e => e.id != "unassigned");
    }
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
