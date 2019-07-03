<template>
  <v-form>
    <v-container>
      <v-layout v-for="(entry, index) in storage" :key="index">
        <v-text-field outlined label="Setting Name" xs6 v-model="entry.key" @input="onChange"></v-text-field>
        <v-text-field outlined label="Setting Value" xs6 v-model="entry.value" @input="onChange"></v-text-field>
      </v-layout>
      <v-btn outlined color="info" @click="addSetting">Add</v-btn>
    </v-container>
  </v-form>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {
      storage: Object.entries(this.value).map(([value, key]) => ({
        key,
        value
      }))
    };
  },
  mounted() {
      this.addSetting();
  },
  methods: {
    addSetting() {
      this.storage.push({ key: "", value: "" });
    },
    onChange() {
      var ret = {};
      this.storage.forEach(entry => (ret[entry.key] = entry.value));
      this.$emit("input", ret);
    }
  }
};
</script>