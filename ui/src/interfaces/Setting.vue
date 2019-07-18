<template>
  <div>
    <v-checkbox
      :readonly="lazyValue.readonly"
      v-if="lazyValue.type === 'Boolean'"
      v-model="lazyValue.value"
      :label="lazyValue.title"
      :hint="lazyValue.description"
      :placeholder="lazyValue.placeholder"
      persistent-hint
      @change="save"
    ></v-checkbox>
    <v-select
      :readonly="lazyValue.readonly"
      v-else-if="lazyValue.choices"
      :items="lazyValue.choices"
      v-model="lazyValue.value"
      outlined
      :label="lazyValue.title"
      :hint="lazyValue.description"
      persistent-hint
    >
      <template v-slot:append>
        <v-btn v-if="dirty" color="green" dark tile @click="save"  class="shift-up">
          <v-icon>check</v-icon>
        </v-btn>
      </template>
    </v-select>
    <v-text-field
      :readonly="lazyValue.readonly"
      v-else
      outlined
      v-model="lazyValue.value"
      :placeholder="lazyValue.placeholder"
      :label="lazyValue.title"
      :hint="lazyValue.description"
      persistent-hint
      :type="lazyValue.type === 'Password' ? 'password' : undefined"
    >
      <template v-slot:append>
        <v-btn v-if="dirty" color="green" dark tile @click="save" class="shift-up">
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
<style>
.shift-up {
  margin-top: -8px;
}
</style>