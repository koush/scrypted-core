<template>
  <v-text-field
    label="Condition Expression"
    v-model="value.condition"
    persistent-hint
    hint="OnOff example: eventData === true"
    @input="onChange"
  ></v-text-field>
</template>

<script>
import RPCInterface from "../RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  data() {
    return {
      model: this.cloneValue(),
    }
  },
  methods: {
    onChange: function() {
      this.rpc({
        varargs: true
      }).evaluate(this.model.condition);
    }
  }
};
</script>
