<template>
    <div class='d-none'>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    data() {
        return {
            model: this.cloneValue(),
        }
    },
    methods: {
        onChange() {
            this.rpc({
                varargs: true,
            }).onEvent();
        }
    }
};
</script>
