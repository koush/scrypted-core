<template>
  <div>
    <div
      v-if="!updateAvailable"
      class="body-2 font-weight-light"
    >{{ device.metadata.npmPackageVersion }}</div>
    <v-btn
      @click="doInstall"
      small
      dark
      block
      outlined
      v-else
      color="blue"
    >Update to {{ updateAvailable }}</v-btn>
  </div>
</template>
<script>
import { getDeviceViewPath } from "../helpers";

import { checkUpdate, installNpm } from "./plugin";

export default {
  props: ["device"],
  mounted() {
    checkUpdate(
      this.device.metadata.npmPackage,
      this.device.metadata.npmPackageVersion
    ).then(updateAvailable => (this.updateAvailable = updateAvailable));
  },
  data() {
    return {
      updateAvailable: false
    };
  },
  methods: {
    doInstall() {
      installNpm(this.device.id, this.device.metadata.npmPackage).then(id =>
        this.$router.push(getDeviceViewPath(id))
      );
    }
  }
};
</script>