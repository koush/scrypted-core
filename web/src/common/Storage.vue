<template>
  <Grower
    v-model="lazyValue"
    :component="StorageEntry"
    :empty="{ key: '', value:''}"
    @input="onInput"
  ></Grower>
</template>
<script>
import Grower from "./Grower.vue";
import StorageEntry from "./StorageEntry.vue";
import CustomValue from "./CustomValue.vue";
import ObjectToArrayValue from "./ObjectToArrayValue.vue";

export default {
  mixins: [CustomValue, ObjectToArrayValue],
  components: {
    Grower
  },
  computed: {
    StorageEntry() {
      return StorageEntry;
    }
  }
};
</script>