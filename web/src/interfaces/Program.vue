<template>
    <div class="form-group col-2">
        <button v-if='device' type="button" class='btn btn-success' @click='onClick'>Run Program</button>
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
            this.rpc({
                varargs: true,
            }).runAsync();
        },
    }
};
</script>
