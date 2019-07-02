<template>
    <div class="row col-12 col-lg-6">
        <div class="form-group">
            <label>Temperature (Kelvin)</label>
            <input ref="kelvin" type="number" class="form-control-range" v-model="value.colorTemperature" :min="properties.temperatureMinK" :max="properties.temperatureMaxK" @change="onChange">
        </div>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue';

export default {
    mixins: [RPCInterface],
    mounted: function() {
        $(this.$refs.kelvin).inputSpinner({
            groupClass: "input-group-sm"
        });
    },
    methods: {
        onChange: function() {
            // this.rpc().setLevel(parseInt(this.value.level));
            this.rpc().setTemperature(parseInt(this.value.colorTemperature));
        },
    }
};
</script>
