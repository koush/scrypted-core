<template>
  <v-switch inset :label="label" v-model="on" color="indigo" @click.self="onClick" @change="onChange"></v-switch>
</template>

<script>
import RPCInterface from "./RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  data: function() {
    return {
      radio: Math.random(),
      on: this.value.on
    };
  },
  computed: {
    label() {
      return this.value.on ? "On" : "Off";
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
      if (this.on) {
        this.turnOn();
      } else {
        this.turnOff();
      }
    },
    onChange: function() {
      console.log("onChange");
      this.value.on = this.on;
      if (!this.device) {
        this.onClick();
      } else {
        this.on = undefined;
      }
    }
  }
};
</script>
