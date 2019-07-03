<template>
  <div class="form-group row">
    <a :href="`https://developer.scrypted.app/#${name.toLowerCase()}`" target="developer">{{ name }}</a>
    <Select2
      v-model="selectedInterfaces"
      :options="mappedInterfaces"
      :multiple="true"
      @input="onChange"
    ></Select2>
  </div>
</template>
<script>
import Select2 from "../common/Select2.vue";

export default {
  props: {
    name: String,
    value: Array,
    devices: Array
  },
  components: {
    Select2
  },
  methods: {
    onChange() {
      this.$emit("input", this.selectedInterfaces);
    },
    mapThem: function() {
      var name = this.name.toLowerCase();
      return this.devices
        .map(device =>
          Object.keys(device[name]).map(iface => ({
            id: device[name][iface],
            text: `${device.name} (${iface})`
          }))
        )
        .flat();
    }
  },
  data: function() {
    var mapped = this.mapThem();
    return {
      selectedInterfaces: this.value
        .map(iface => mapped.find(e => e.id == iface))
        .filter(e => e != null)
    };
  },
  computed: {
    mappedInterfaces: {
      get: function() {
        return this.mapThem();
      }
    }
  }
};
</script>