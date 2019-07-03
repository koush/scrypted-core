<template>
  <v-autocomplete
    outlined
    :multiple="multiple"
    :chips="multiple"
    :items="sortedOptions"
    v-model="selected"
    :label="label"
    item-value="id"
    return-object
    @input="onChange"
  ></v-autocomplete>
</template>

<script>
import Vue from "vue";

export default {
  props: ["label", "options", "value", "unselected", "multiple"],
  data: function() {
    const selected = Vue.util.extend({}, this.value);
    const sortedOptions = this.makeSortedOptions(selected);
    return {
      selected,
      sortedOptions
    };
  },
  methods: {
    makeSortedOptions(selected) {
      if (!this.multiple) {
        selected = [selected];
      }
      const selectedIds = selected.map(item => item.id);
      const sortedOptions = Vue.util
        .extend([], this.options)
        .filter(item => !selectedIds.includes(item.id));

      sortedOptions.unshift(...selected);
      return sortedOptions;
    },
    onChange() {
      this.sortedOptions = this.makeSortedOptions(this.selected);
      this.$emit("input", this.selected);
    }
  }
};
</script>