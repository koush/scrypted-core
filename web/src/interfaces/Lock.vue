<template>
  <v-flex>
    <v-btn class="mx-2" fab @click="unlock" :color="value.lockState === 'Locked' ? '#a9afbb' : 'orange'" dark>
      <v-icon >lock_open</v-icon>
    </v-btn>
    <v-btn class="mx-2" fab @click="lock" :color="value.lockState === 'Locked' ? 'green' : '#a9afbb'" dark>
      <v-icon>lock</v-icon>
    </v-btn>
  </v-flex>
</template>

<script>
import RPCInterface from "./RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  data: function() {
    return {
      radio: Math.random(),
      locked: this.value.lockState == "Locked"
    };
  },
  methods: {
    lock: function() {
      this.locked = true;
      this.onChange();
    },
    unlock: function() {
      this.locked = false;
      this.onChange();
    },
    onChange: function() {
      // prefer locked in case of error.
      if (this.locked) {
        this.rpc().lock();
      } else {
        this.rpc().unlock();
      }
    }
  }
};
</script>
