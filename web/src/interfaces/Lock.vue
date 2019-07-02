<template>
    <div class="form-group">
        <div class="btn-group btn-group-toggle">
            <label class="btn btn-outline-success" :class="{active: locked === true}">
                <input :name='radio' type="radio" v-model='locked' :value="true" @change='onChange' @click="lock">Lock
            </label>
            <label class="btn btn-outline-success" :class="{active: locked === false}">
                <input :name='radio' type="radio" v-model='locked' :value="false" @change='onChange' @click="unlock">Unlock
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
            locked: this.value.lockState == 'Locked',
        }
    },
    methods: {
        lock: function() {
            this.rpc().lock();
        },
        unlock: function() {
            this.rpc().unlock();
        },
        onChange: function() {
            // prefer locked in case of error.
            this.value.lockState = this.locked === false ? 'Unlocked' : 'Locked';
            if (!this.device) {
                if (this.locked)
                    this.lock();
                else
                    this.unlock();
            }
            if (this.device)
                this.lockState = undefined;
        },
    }
};
</script>
