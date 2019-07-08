<template>
  <div>
    <component
      v-bind="componentProps"
      @input="onInput"
      v-for="(item, index) in lazyValue"
      :key="index"
      :is="component"
      v-model="lazyValue[index]"
    ></component>
    <v-btn @click="add">{{ addButton }}</v-btn>
  </div>
</template>
<script>
import cloneDeep from "lodash.clonedeep";
import CustomValue from "./CustomValue.vue";

export default {
  props: {
    empty: undefined,
    component: undefined,
    componentProps: undefined,
    addButton: {
      default: "Add",
      type: String
    }
  },
  mixins: [CustomValue],
  methods: {
    add() {
      this.lazyValue.push(cloneDeep(this.empty));
    }
  }
};
</script>
