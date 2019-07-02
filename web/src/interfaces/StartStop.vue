<template>
    <div class="form-group">
        <div class="btn-group btn-group-toggle">
            <label class="btn btn-outline-success" :class="{active: action === 'start'}">
                <input :name='radio' type="radio" v-model="action" value="start" @change='onChange'> Start
            </label>
            <label v-if="properties.pausable" class="btn btn-outline-info" :class="{active: action === 'pause'}">
                <input :name='radio' type="radio" v-model="action" value="pause" @change='onChange'> Pause
            </label>
            <label v-if="properties.pausable" class="btn btn-outline-info" :class="{active: action === 'resume'}">
                <input :name='radio' type="radio" v-model="action" value="resume" @change='onChange'> Resume
            </label>
            <label class="btn btn-outline-secondary" :class="{active: action === 'stop'}">
                <input :name='radio' type="radio" v-model="action" value="stop" @change='onChange'> Stop
            </label>
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
            action: this.action || (this.value.paused ? "pause" : this.value.running ? "start" : "stop")
        }
    },
    methods: {
        onChange: function() {
            this.value.action = this.action;
            if (this.value.action == 'start') {
                this.rpc().start();
            }
            else if (this.value.action == 'pause') {
                this.rpc().pause();
            }
            else if (this.value.action == 'resume') {
                this.rpc().resume();
            }
            else if (this.value.action == 'stop') {
                this.rpc().stop();
            }
            if (this.device)
                this.action = undefined;
        },
    }
};
</script>
