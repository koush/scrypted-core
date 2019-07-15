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
    getRgb() {
      return Object.assign(
        {
          r: 255,
          g: 255,
          b: 255
        },
        this.lazyValue.rgb
      );
    },
    createInputValue() {
      var ret = cloneDeep(this.lazyValue);
      delete ret.rgb.a;
      return ret;
    },
    createLazyValue() {
      var ret = cloneDeep(this.value);
      ret.rgb = Object.assign({ r: 0, g: 0, b: 0, a: 255 }, ret.rgb);
      return ret;
    },
    debounceSetRgb: throttle(function() {
      const { r, g, b } = this.getRgb();
      this.rpc().setRgb(r, g, b);
    }, 500),
    onChange() {
      const { r, g, b } = this.getRgb();
      if (
        this.value.rgb &&
        this.value.rgb.r == r &&
        this.value.rgb.g == g &&
        this.value.rgb.b == b
      ) {
        return;
      }

      if (this.device) {
        if (
          this.lazyValue.rgb.r === 0 &&
          this.lazyValue.rgb.g === 0 &&
          this.lazyValue.rgb.b === 0
        ) {
          // there is no change event on this control, so watch to see if this
          // is a round trip value change from the parent component, and bail.
          return;
        }
        this.debounceSetRgb();
        return;
      }
      this.rpc().setRgb(r, g, b);
    }
  }
};
</script>
