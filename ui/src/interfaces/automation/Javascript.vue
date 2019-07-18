<template>
  <v-textarea label="Script" v-model="value.script" outlined auto-grow></v-textarea>
</template>

<script>
import RPCInterface from "../RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  methods: {
    onChange: function() {
      this.rpc({
        varargs: true
      }).run(this.lazyValue.script);
    }
  }
};
</script>
