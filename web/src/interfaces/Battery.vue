<template>
    <div class="form-group">
        <span v-if="batteryLevel > 80"><i class="fas fa-battery-full"></i> {{ batteryLevel }}%</span>
        <span v-else-if="batteryLevel > 60"><i class="fas fa-battery-three-quarters"></i> {{ batteryLevel }}%</span>
        <span v-else-if="batteryLevel > 40"><i class="fas fa-battery-half"></i> {{ batteryLevel }}%</span>
        <span v-else-if="batteryLevel > 20"><i class="fas fa-battery-quarter"></i> {{ batteryLevel }}%</span>
        <span v-else><i class="fas fa-battery-empty"></i> {{ batteryLevel }}%</span>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    data: function() {
        return {
            batteryLevel: Math.round(this.value.batteryLevel)
        }
    },
};
</script>
