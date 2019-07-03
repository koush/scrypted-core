<template>
  <v-flex>
    <v-btn dark :color="model.checkUpdate ? 'indigo' : '#a9afbb'" @click="checkForUpdate">Check for Update</v-btn>
    <v-btn dark :color="model.checkUpdate ? '#a9afbb' : 'indigo'" @click="installUpdate">Install Updates</v-btn>
  </v-flex>
  <!-- <div class="form-group row col-2" v-if="!device">
        <div class="btn-group btn-group-toggle">
            <label class="btn btn-outline-success" :class="{active: checkUpdate === true}">
                <input :name='radio' type="radio" v-model='checkUpdate' :value="true" @change='onChange' @click='checkForUpdate'>Check For Update
            </label>
            <label class="btn btn-outline-success" :class="{active: checkUpdate === false}">
                <input :name='radio' type="radio" v-model='checkUpdate' :value="false" @change='onChange' @click='installUpdate'>Install Update
            </label>
            <br>
        </div>
  </div>-->
</template>

<script>
import RPCInterface from "./RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  data: function() {
    return {
      radio: Math.random(),
      model: this.cloneValue()
    };
  },
  methods: {
    checkForUpdate: function() {
      this.model.checkUpdate = true;
      this.onChange();
    },
    installUpdate: function() {
      this.model.checkUpdate = false;
      this.onChange();
    },
    onChange() {
      this.model.checkUpdate = this.model.checkUpdate || false;
      if (this.model.checkUpdate) {
        this.rpc().checkForUpdate();
      } else {
        this.rpc().installUpdate();
      }
    }
  }
};
</script>
