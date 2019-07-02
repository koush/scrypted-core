<script>
import RPCInterface from './RPCInterface.vue';
import 'bootstrap-colorpicker';
import debounce from 'lodash/debounce';

export default {
    mixins: [RPCInterface],
    methods: {
        supportsColor: function() {
            return this.properties.supportsSpectrumRgb || this.properties.supportsSpectrumHsv;
        },
        maybeDebounce: function(f) {
            if (this.device) {
                return debounce(f, 500);
            }
            return f;
        },
        onChange: function() {
            // this.rpc().setLevel(parseInt(this.value.level));
            this.rpc().setTemperature(parseInt(this.value.temperature));
        },
    }
};
</script>

<style>
@import "../../node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css";
</style>