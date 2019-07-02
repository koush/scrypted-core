<template>
    <div class="row col-12 col-lg-6">
        <div class="form-group">
            <label>Brightness</label>
            <input ref="brightness" type="number" class="form-control-range" v-model="value.brightness" :min="0" :max="100" @change="brightness">
        </div>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    mounted: function() {
        $(this.$refs.brightness).inputSpinner({
            groupClass: "input-group-sm"
        });
    },
    methods: {
        brightness: function() {
            this.rpc().setBrightness(parseInt(this.value.brightness));
        },
    }
};
</script>
