<template>
    <div class='form-group'>
        <a class='btn btn-info' target="_blank" :href='endpoint()'>View Plugin Web Endpoint</a>
    </div>
</template>
<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    methods: {
        endpoint: function() {
            return `/endpoint/${this.properties.endpoint}/`
        }
    }
};
</script>