<template>
    <div class="form-group col-2">
        <span v-if="temperature > 30"><i class="fas fa-thermometer-full"></i> {{ userTemperature }}</span>
        <span v-else-if="temperature > 20"><i class="fas fa-thermometer-three-quarters"></i> {{ userTemperature }}</span>
        <span v-else-if="temperature > 10"><i class="fas fa-thermometer-half"></i> {{ userTemperature }}</span>
        <span v-else-if="temperature > 5"><i class="fas fa-thermometer-quarter"></i> {{ userTemperature }}</span>
        <span v-else><i class="fas fa-thermometer-empty"></i> {{ userTemperature }}</span>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    computed: {
        userTemperature: {
            get() {
                if (this.value.temperatureUnit == 'F') {
                    return (this.temperature * 9/5) + 32 + '° F';
                }
                return this.temperature + '° C';
            }
        }
    },
    data: function() {
        return {
            temperature: Math.round(this.value.temperature)
        }
    },
};
</script>
