<template>
    <div class="form-group col-2">
        <div class="btn-group btn-group-toggle">
            <label class="btn btn-outline-success" :class="{active: activate === true}">
                <input :name='radio' type="radio" v-model='activate' :value="true" @change='onChange'> Activate
            </label>
            <label v-if='properties.reversible' class="btn btn-outline-success" :class="{active: activate === false}">
                <input :name='radio' type="radio" v-model='activate' :value="false" @change='onChange'> Deactivate
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
            activate: this.value.activate,
        }
    },
    methods: {
        onChange: function() {
            this.value.activate = this.activate;
            if (this.value.activate)
                this.rpc().activate();
            else
                this.rpc().deactivate();

            if (this.device)
                this.activate = undefined;
        },
    }
};
</script>
