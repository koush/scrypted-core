<template>
    <div class="form-group">
        <button v-if='device' type="button" class='btn btn-outline-secondary' @click='onClick'>Dock</button>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    mounted: function() {
        // this is an implicit command, so immediately trigger the change.
        if (!this.device) {
            this.onClick();
        }
    },
    methods: {
        onClick: function() {
            this.rpc().dock();
        },
    }
};
</script>
