<template>
    <div>
        <div class="form-group">
            <label class="form-label">VideoCamera</label>
            <Select2 v-model='selected' :options="videoInterfaces" :unselected='unselected' @input='onChange'>
            </Select2>
        </div>
    </div>
</template>
<script>
import RPCInterface from '../RPCInterface.vue'

function unassigned() {
    return {
        id: 'unassigned',
        text: 'Select VideoCamera',
        component: 'Unassigned',
        model: {},
    };
}

export default {
    mixins: [RPCInterface],
    props: {
        events: Array,
        interfaces: Array,
        unselected: {
            type: Object,
            default: unassigned,
        },
    },
    mounted: function() {
        if (!this.selected) {
            this.selected = unassigned();
            this.onChange();
        }
    },
    data: function() {
        return {
            selected: this.interfaces.find(e => e.id == this.value.id) || unassigned(),
        }
    },
    computed: {
        videoInterfaces: function() {
            return this.interfaces.filter(iface => iface.component === 'VideoCamera');
        },
    },
    methods: {
        onChange: function() {
            this.value.id = this.selected.id;
            this.rpc().detectFaces(this.value.id);
        }
    }
}
</script>