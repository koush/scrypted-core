<template>
    <div class="form-group row col-2" v-if="!device">
        <div class="btn-group btn-group-toggle">
            <label class="btn btn-outline-success" :class="{active: checkUpdate === true}">
                <input :name='radio' type="radio" v-model='checkUpdate' :value="true" @change='onChange' @click='checkForUpdate'>Check For Update
            </label>
            <label class="btn btn-outline-success" :class="{active: checkUpdate === false}">
                <input :name='radio' type="radio" v-model='checkUpdate' :value="false" @change='onChange' @click='installUpdate'>Install Update
            </label>
            <br>
        </div>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    data: function() {
        return {
            radio: Math.random(),
            checkUpdate: this.value.checkUpdate,
        }
    },
    methods: {
        checkForUpdate: function() {
            this.rpc().checkForUpdate();
        },
        installUpdate: function() {
            this.rpc().installUpdate();
        },
        onChange: function() {
            this.value.checkUpdate = this.checkUpdate;
            if (!this.device) {
                if (this.checkUpdate) {
                    this.checkForUpdate();
                }
                else {
                    this.installUpdate();
                }
            }
            else {
                this.checkUpdate = undefined;
            }
        },
    }
};
</script>
