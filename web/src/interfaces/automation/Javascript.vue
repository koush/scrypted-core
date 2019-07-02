<template>
    <div class="form-group">
        <label class="form-label">Script</label>
        <textarea v-model='value.script' class="form-control" @input='onChange'/>
    </div>
</template>

<script>
import RPCInterface from '../RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    methods: {
        onChange: function() {
            this.rpc({
                varargs: true,
            }).run(this.value.script);
        },
    }
};
</script>
