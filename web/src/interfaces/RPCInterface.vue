<script>
import CustomValue from "../common/CustomValue.vue";

export default {
  props: {
    device: String,
    value: Object,
    properties: Object
  },
  mixins: [CustomValue],
  mounted() {
    // call onChange to guarantee sane values.
    if (!this.device && !this.lazyValue.rpc) {
      this.onChange();
    }
  },
  methods: {
    rpc(options) {
      options = options || {};
      const { modelUpdate, varargs } = options;
      var vm = this;
      return new Proxy(
        {},
        {
          get: function(target, method) {
            return function() {
              var parameters = Array.prototype.slice.call(arguments);
              if (!vm.device) {
                vm.lazyValue.rpc = {
                  method,
                  parameters,
                  varargs
                };
                vm.onInput();
                return;
              }
              if (modelUpdate) return;
              return fetch(
                `/web/device/${vm.device}/rpc/${vm.$options.name}/${method}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    parameters: parameters
                  })
                }
              );
            };
          }
        }
      );
    }
  }
};
</script>