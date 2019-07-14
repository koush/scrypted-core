<template>
  <v-flex xs12>
    <v-layout>
      <v-flex xs12>
        <v-form>
          <Setting
            :device="device"
            v-for="setting in settings"
            :key="setting.key"
            v-model="setting.value"
          ></Setting>
        </v-form>
      </v-flex>
    </v-layout>
  </v-flex>
</template>
<script>
import RPCInterface from "./RPCInterface.vue";
import Setting from "./Setting.vue";

export default {
  components: {
    Setting
  },
  mixins: [RPCInterface],
  data() {
    return {
      settings: []
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.rpc()
        .getSettings()
        .then(settings => {
          this.settings = settings.map(setting => ({
            key: setting.key,
            value: setting
          }));
        });
    }
  }
};
</script>
