<template>
    <div class="form-group row col-2">
        <button v-if="occupied" class="btn btn-success">Occupied</button>
        <button v-else class="btn btn-outline-success">Unoccupied</button>
    </div>
</template>

<script>
import RPCInterface from '../RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    data: function() {
        return {
            radio: Math.random(),
            occupied: this.value.occupied,
        }
    },
}
</script>