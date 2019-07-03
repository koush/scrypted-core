<script>
import cloneDeep from "lodash.clonedeep";

export default {
  props: {
    device: String,
    value: Object,
    properties: Object
  },
  mounted() {
    // call onChange to guarantee sane values.
    if (!this.device) {
      this.onChange();
    }
  },
  methods: {
    cloneValue() {
      return cloneDeep(this.value);
    },
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
                vm.model.rpc = {
                  method,
                  parameters,
                  varargs
                };
                vm.$emit("input", vm.model);
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