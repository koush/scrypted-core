<template>
  <v-flex xs12 md10 lg8 xl6>
    <v-flex>
      <v-card
        v-if="managedDevices.devices.length"
        raised
        class="header-card"
        style="margin-bottom: 60px"
      >
        <v-card-title
          class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
        >
          <font-awesome-icon size="sm" icon="database" />
          <span class="title font-weight-light">&nbsp;&nbsp;Managing Devices</span>
        </v-card-title>
        <div class="header-card-spacer"></div>
        <v-card-text>These devices were created by {{ name }}.</v-card-text>
        <DeviceGroup :deviceGroup="managedDevices"></DeviceGroup>
      </v-card>
    </v-flex>

    <v-flex>
      <v-card raised class="header-card" style="margin-bottom: 60px">
        <v-card-title
          class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
        >{{ script.npmPackage ? "Plugin Managemnet" : "Edit Script" }}</v-card-title>
        <div class="header-card-spacer"></div>

        <v-form>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <ScriptVariablesPicker
                  v-if="hasVars"
                  v-model="script.vars"
                  :scriptType="script.type"
                  :actions="deviceProps.actions"
                  :addButton="!!!deviceProps.npmPackage"
                  @input="onChange"
                ></ScriptVariablesPicker>

                <v-textarea
                  style="margin-top: 16px;"
                  v-if="!script.gistInSync && !script.npmPackage"
                  auto-grow
                  rows="10"
                  v-model="script.script"
                  outlined
                  label="Script"
                  @input="onChange"
                ></v-textarea>
                <div v-else-if="!script.npmPackage" xs12 ref="gist" style="margin-top: 16px;"></div>

                <v-btn outlined color="blue" @click="reload" xs4>Reload</v-btn>
                <v-btn xs4 outlined color="blue" @click="showStorage = !showStorage">Storage</v-btn>
                <v-btn outlined color="green" @click="debug" xs4>Debug</v-btn>
                <v-alert
                  style="margin-top: 16px;"
                  outlined
                  v-model="showCompilerResult"
                  dismissible
                  close-text="Close Alert"
                  type="success"
                >
                  <div v-html="compilerResult"></div>
                </v-alert>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>

    <v-flex v-if="showStorage">
      <v-card raised class="header-card" style="margin-bottom: 60px">
        <v-card-title
          class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
        >Script Storage</v-card-title>
        <div class="header-card-spacer"></div>
        <v-form>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <Storage v-model="script.configuration" @input="onChange"></Storage>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>
  </v-flex>
</template>
<script>
import cloneDeep from "lodash.clonedeep";
import DeviceGroup from "../common/DeviceTable.vue";
import ScriptVariablesPicker from "./script/ScriptVariablesPicker.vue";
import axios from "axios";
import qs from "query-string";
import Storage from "../common/Storage.vue";

export default {
  props: ["value", "id", "name", "componentWebPath", "deviceProps"],
  components: {
    DeviceGroup,
    ScriptVariablesPicker,
    Storage
  },
  data: function() {
    return {
      compilerResult: undefined,
      script: Object.assign(cloneDeep(this.deviceProps.script), {
        vars: cloneDeep(this.deviceProps.vars)
      }),
      showStorage: false
    };
  },
  mounted() {
    this.doGist();
  },
  watch: {
    id() {
      this.doGist();
    }
  },
  methods: {
    onChange() {
      this.$emit("input", this.script);
    },
    doGist() {
      if (!this.deviceProps.gistEmbed) {
        return;
      }

      const nativeWrite = document.write;
      this.$refs.gist.innerHTML = "";
      document.write = str => {
        this.$refs.gist.innerHTML += str;
      };
      var tag = document.createElement("script");
      tag.src = this.deviceProps.gistEmbed;
      this.$refs.gist.appendChild(tag);
      tag.onload = () => {
        document.write = nativeWrite;
      };
    },
    debug() {
      axios
        .post(
          `${this.componentWebPath}/debugTarget`,
          qs.stringify({
            thingId: this.script.id
          })
        )
        .then(response => {
          this.compilerResult = response.data;
        });
    },
    reload() {
      axios
        .post(`${this.componentWebPath}/reload/${this.script.id}`)
        .then(response => {
          this.compilerResult = response.data.length
            ? "Reload output:" + response.data
            : this.script.npmPackage
            ? "Plugin reloaded."
            : "Script reloaded.";
        });
    }
  },
  computed: {
    hasVars() {
      return (
        !this.script.npmPackage ||
        !this.script.npmPackageJson ||
        (this.script.npmPackageJson.scrypted &&
          this.script.npmPackageJson.scrypted.variables)
      );
    },
    showCompilerResult: {
      get() {
        return !!this.compilerResult;
      },
      set(value) {
        this.compilerResult = value ? this.compilerResult : "";
      }
    },
    managedDevices() {
      const devices = Object.keys(this.$store.state.systemState)
        .filter(
          id =>
            this.$store.state.systemState[id].metadata.value.ownerPlugin ===
            this.id
        )
        .map(id => ({
          id,
          name: this.$store.state.systemState[id].name.value,
          type: this.$store.state.systemState[id].type.value
        }));
      return {
        devices
      };
    }
  }
};
</script>