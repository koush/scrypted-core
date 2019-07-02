<template>
    <div class="form-group col-2">
        <span><i class="fas fa-tint"></i> {{ humidity }}%</span>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    data: function() {
        return {
            humidity: Math.round(this.value.humidity)
        }
    },
};
</script>
