<template>
    <div class="form-group row col-2">
        <div class="btn-group btn-group-toggle">
            <label class="btn btn-outline-success" :class="{active: entryOpen === true}">
                <input :name='radio' type="radio" v-model='entryOpen' :value="true" @change='onChange' @click='openEntry'> Open
            </label>
            <label class="btn btn-outline-success" :class="{active: entryOpen === false}">
                <input :name='radio' type="radio" v-model='entryOpen' :value="false" @change='onChange' @click='closeEntry'> Close
            </label>
            <br>
        </div>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    data: function() {
        return {
            radio: Math.random(),
            entryOpen: this.value.entryOpen,
        }
    },
    methods: {
        openEntry: function() {
            this.rpc().openEntry();
        },
        closeEntry: function() {
            this.rpc().closeEntry();
        },
        onChange: function() {
            this.value.entryOpen = this.entryOpen;
            if (!this.device) {
                if (this.entryOpen) {
                    this.openEntry();
                }
                else {
                    this.closeEntry();
                }
            }
            else {
                this.entryOpen = undefined;
            }
        },
    }
};
</script>
