<template>
  <div>
    <v-checkbox
      v-if="lazyValue.type === 'Boolean'"
      v-model="lazyValue.value"
      :label="lazyValue.title"
      :hint="lazyValue.description"
      :placeholder="lazyValue.placeholder"
      persistent-hint
      @change="save"
    ></v-checkbox>
    <v-text-field
      v-else
      outlined
      solo
      flat
      v-model="lazyValue.value"
      :label="lazyValue.title"
      :hint="lazyValue.description"
      :placeholder="lazyValue.placeholder"
      persistent-hint
      :type="lazyValue.type === 'Password' ? 'password' : undefined"
    >
      <template v-slot:append>
        <v-btn v-if="dirty" color="green" dark tile @click="save">
          <v-icon>check</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>
<script>
import RPCInterface from "./RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  props: ["device"],
  computed: {
    dirty() {
      return this.lazyValue.value !== this.value.value;
    }
  },
  methods: {
    save() {
      this.rpc().putSetting(this.lazyValue.key, this.lazyValue.value);
      this.onInput();
    }
  }
};
</script>
