<template>
  <v-flex>
    <v-layout row>
      <v-text-field
        ref="variableName"
        outlined
        label="Setting Name"
        xs6
        v-model="lazyValue.key"
        @input="onInput"
      ></v-text-field>
      <v-text-field
        ref="variableValue"
        outlined
        label="Setting Value"
        xs6
        v-model="lazyValue.value"
        @input="onInput"
      ></v-text-field>
    </v-layout>
  </v-flex>
</template>
<script>
import CustomValue from "./CustomValue.vue";

export default {
  name: "StorageEntry",
  mixins: [
    CustomValue
  ],
};
</script>