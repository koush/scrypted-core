<template>
  <v-layout align-center justify-center>
    <v-color-picker
      v-model="lazyValue.rgb"
      mode="rgba"
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
      delete ret.rgb.a;
      return ret;
    },
    createLazyValue() {
      var ret = cloneDeep(this.value);
      ret.rgb = Object.assign({ a: 1 }, ret.rgb);
      return ret;
    },
    debounceSetRgb: throttle(function() {
      const { r, g, b } = this.lazyValue.rgb;
      this.rpc().setRgb(r || 1, g || 1, b || 1);
    }, 500),
    onChange() {
      if (this.device) {
        this.debounceSetRgb();
        return;
      }
      const { r, g, b } = this.lazyValue.rgb;
      this.rpc().setRgb(r || 1, g || 1, b || 1);
    }
  }
};
</script>
