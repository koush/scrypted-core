<template>
    <div class='d-none'>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    mounted: function() {
        // this is an implicit command, so immediately trigger the change.
        if (!this.device) {
            this.onEvent();
        }
    },
    methods: {
        onEvent: function() {
            this.rpc({
                varargs: true,
            }).onEvent();
        },
    }
};
</script>
