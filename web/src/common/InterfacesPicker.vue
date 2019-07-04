<template>
  <Grower v-model="lazyValue" :component="InterfacePicker" :empty="unassigned" @input="onInput" :componentProps="{interfaces}"></Grower>
</template>

<script>
import InterfacePicker from "./InterfacePicker.vue";
import CustomValue from "./CustomValue.vue";
import Grower from "./Grower.vue";


export default {
  props: {
    name: String,
    interfaces: Array
  },
  mixins: [CustomValue],
  components: {
    Grower,
  },
  computed: {
    InterfacePicker() {
      return InterfacePicker;
    },
    unassigned() {
      return {
        // unique per interfaces array
        id: "unassigned",
        model: {}
      };
    }
  },
  methods: {
    createInputValue() {
      return this.lazyValue.slice().filter(e => e.id != "unassigned");
    }
  }
};
</script>
