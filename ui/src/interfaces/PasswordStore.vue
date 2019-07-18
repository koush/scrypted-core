<template>
  <v-form>
    <v-container>
      <v-layout>
        <v-flex>
          <Grower
            :componentProps="componentProps"
            addButton="Add Password"
            v-model="passwords"
            :component="PasswordEntry"
            :empty="{ key: '', value:''}"
            @input="onInput"
          ></Grower>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import RPCInterface from "./RPCInterface.vue";
import Grower from "../common/Grower.vue";
import PasswordEntry from "./PasswordEntry.vue";

export default {
  mixins: [RPCInterface],
  components: {
    Grower,
  },
  data() {
    return {
      PasswordEntry,
      passwords: []
    };
  },
  watch: {
    value() {
      this.refresh();
    }
  },
  computed: {
    componentProps() {
      return {
        device: this.device
      };
    }
  },
  methods: {
    async refresh() {
      this.passwords = (await this.rpc().getPasswords()).map(
        (password, index) => ({
          key: index,
          value: password
        })
      );
    }
  },
  mounted() {
    this.refresh();
  },
  onChange() {}
};
</script>