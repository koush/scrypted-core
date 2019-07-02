<template>
  <div>
    <v-slider v-model="hours" label="Hours" thumb-label="always" min="0" max="23"></v-slider>
    <v-slider v-model="minutes" label="Minutes" thumb-label="always" min="0" max="59"></v-slider>
    <v-slider v-model="seconds" label="Seconds" thumb-label="always" min="0" max="59"></v-slider>
  </div>
</template>

<script>
import RPCInterface from "../RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  computed: {
    hours: {
      get() {
        return Math.floor(this.value.seconds / 60 / 60);
      },
      set(value) {}
    },
    minutes: {
      get() {
        return Math.floor(this.value.seconds / 60) % 60;
      },
      set(value) {}
    },
    seconds: {
      get() {
        return this.value.seconds % 60;
      },
      set(value) {}
    }
  }
};
</script>
