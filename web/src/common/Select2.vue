<template>
  <v-autocomplete
    outlined
    :multiple="multiple"
    :chips="multiple"
    :items="sortedOptions"
    v-model="lazyValue"
    :label="label"
    item-value="id"
    return-object
    ref="autocomplete"
    @input="onInput"
  ></v-autocomplete>
</template>

<script>
import Vue from "vue";
import CustomValue from "./CustomValue.vue";

export default {
  props: ["label", "options", "unselected", "multiple"],
  mixins: [CustomValue],
  computed: {
    sortedOptions() {
      var selected = this.lazyValue;
      if (!this.multiple) {
        selected = [selected];
      }
      const selectedIds = selected.map(item => item.id);
      const sortedOptions = Vue.util
        .extend([], this.options)
        .filter(item => !selectedIds.includes(item.id));

      sortedOptions.unshift(...selected);
      if (this.unselected) {
        sortedOptions.unshift(this.unselected);
      }
      return sortedOptions;
    }
  },
};
</script>