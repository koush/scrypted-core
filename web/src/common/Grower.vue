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
    <v-btn @click="add">Add</v-btn>
  </div>
</template>
<script>
import cloneDeep from "lodash.clonedeep";
import CustomValue from "./CustomValue.vue";

export default {
  props: ["component", "empty", "componentProps"],
  mixins: [CustomValue],
  methods: {
    add() {
      this.lazyValue.push(cloneDeep(this.empty));
    }
  }
};
</script>
