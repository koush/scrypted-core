<template>
  <v-flex>
    <v-btn class="mx-2" fab @click="unlock" :color="model.lockState === 'Locked' ? '#a9afbb' : 'orange'" dark>
      <v-icon >lock_open</v-icon>
    </v-btn>
    <v-btn class="mx-2" fab @click="lock" :color="model.lockState === 'Locked' ? 'green' : '#a9afbb'" dark>
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
      model: this.cloneValue(),
    };
  },
  methods: {
    lock: function() {
      this.model.lockState = 'Locked';
      this.onChange();
    },
    unlock: function() {
      this.model.lockState = 'Unlocked';
      this.onChange();
    },
    onChange: function() {
      // prefer locked in case of error.
      if (this.model.lockState !== 'Unlocked') {
        this.rpc().lock();
      } else {
        this.rpc().unlock();
      }
    }
  }
};
</script>
