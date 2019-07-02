<template>
    <div class="card form-group col-12">
        <img :src="imageUrl" />
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    computed: {
        imageUrl: {
            get() {
                return `/web/device/${this.device}/picture`;
            }
        }
    }
};
</script>
