<template>
  <div>
    <v-checkbox
      :readonly="lazyValue.readonly"
      v-if="lazyValue.type && lazyValue.type.toLowerCase() === 'boolean'"
      v-model="booleanValue"
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
      <template v-slot:append-outer>
        <v-btn v-if="dirty" color="green" dark tile @click="save" class="shift-up">
          <v-icon>check</v-icon>
        </v-btn>
      </template>
    </v-select>
    <v-select
      v-else-if="lazyValue.type && lazyValue.type.toLowerCase().startsWith('device')"
      v-model="lazyValue.value"
      :items="devices"
      outlined
      :label="lazyValue.title"
      :hint="lazyValue.description"
      persistent-hint
    >
      <template v-slot:append-outer>
        <v-btn v-if="dirty" color="green" dark tile @click="save" class="shift-up">
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
      :type="lazyValue.type && lazyValue.type.toLowerCase() === 'password' ? 'password' : undefined"
    >
      <template v-slot:append-outer>
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
    booleanValue: {
      get() {
        return this.lazyValue.value && this.lazyValue.value.toLowerCase() === 'true';
      },
      set(val) {
        this.lazyValue.value = val.toString();
      }
    },
    dirty() {
      return this.lazyValue.value !== this.value.value;
    },
    devices() {
      var expression;
      try {
        expression = this.lazyValue.type.split(":")[1];
        // var interfaces = this.$scrypted.systemManager.getDeviceById(id).interfaces.map(iface => `var ${iface} = true`);
      } catch (e) {
        expression = "true;";
      }
      return this.$store.state.scrypted.devices
        .map(id => this.$scrypted.systemManager.getDeviceById(id))
        .filter(device => {
          try {
            return eval(
              `(function() { var interfaces = ${JSON.stringify(
                device.interfaces
              )}; var type='${device.type}'; return ${expression} })`
            )();
          } catch (e) {
            return true;
          }
        })
        .map(device => ({
          id: device.id,
          text: device.name
        }));
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