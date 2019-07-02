<script>
export default {
    props: {
        device: String,
        value: Object,
        properties: Object,
    },
    methods: {
        rpc: function(options) {
            options = options || {};
            const { modelUpdate, varargs } = options;
            var vm = this;
            return new Proxy({}, {
                get: function(target, method) {
                    return function() {
                        var parameters = Array.prototype.slice.call(arguments);
                        if (!vm.device) {
                            vm.value.rpc = {
                                method,
                                parameters,
                                varargs,
                            };
                            vm.$emit('input', vm.value)
                            return;
                        }
                        if (modelUpdate)
                            return;
                        return fetch(`/web/device/${vm.device}/rpc/${vm.$options.name}/${method}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                parameters: parameters,
                            }),
                        });
                    };
                },
            });
        }
    }
}
</script>