<template>
  <v-layout align-center justify-center>
    <v-color-picker
      v-model="lazyValue.hsv"
      mode="hsla"
      class="ma-2"
      show-swatches
      @input="onChange"
    ></v-color-picker>
  </v-layout>
</template>

<script>
import RPCInterface from "./RPCInterface.vue";
import throttle from "lodash.throttle";
import cloneDeep from "lodash.clonedeep";

export default {
  mixins: [RPCInterface],
  methods: {
    createInputValue() {
      var ret = cloneDeep(this.lazyValue);
      delete ret.hsv.a;
      return ret;
    },
    createLazyValue() {
      var ret = cloneDeep(this.value);
      ret.hsv = Object.assign({ a: 1 }, ret.hsv);
      return ret;
    },
    debounceSetHsv: throttle(function() {
      const { h, s, v } = this.lazyValue.hsv;
      this.rpc().setHsv(h || 360, s || 1, v || 1);
    }, 500),
    onChange() {
      if (this.device) {
        this.debounceSetHsv();
        return;
      }
      const { h, s, v } = this.lazyValue.hsv;
      this.rpc().setHsv(h || 360, s || 1, v || 1);
    }
  }
};
</script>
