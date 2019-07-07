<template>
  <v-switch
    inset
    :label="label"
    v-model="lazyValue.on"
    color="indigo"
    @click.self="onClick"
    @change="onChange"
  ></v-switch>
</template>

<script>
import RPCInterface from "./RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  computed: {
    label() {
      return this.lazyValue.on ? "On" : "Off";
    }
  },
  methods: {
    turnOn: function() {
      this.rpc().turnOn();
    },
    turnOff: function() {
      this.rpc().turnOff();
    },
    onClick() {
      // click.self is fired only if it does not change.
      if (this.lazyValue.on) {
        this.turnOn();
      } else {
        this.turnOff();
      }
    },
    onChange: function() {
      // guard with this.device as device calls are actually done in onClick
      if (!this.device) {
        if (this.lazyValue.on) {
          this.turnOn();
        } else {
          this.turnOff();
        }
      }
    }
  }
};
</script>
