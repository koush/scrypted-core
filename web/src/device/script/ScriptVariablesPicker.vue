<template>
  <Grower
    v-model="lazyValue"
    :component="ScriptVariablePicker"
    :empty="unassigned"
    @input="onInput"
    :componentProps="componentProps"
  ></Grower>
</template>

<script>
import ScriptVariablePicker from "./ScriptVariablePicker.vue";
import CustomValue from "../../common/CustomValue.vue";
import Grower from "../../common/Grower.vue";

export default {
  props: ["addButton", "value", "actions", "scriptType"],
  mixins: [CustomValue],
  components: {
    Grower
  },
  computed: {
    ScriptVariablePicker() {
      return ScriptVariablePicker;
    },
    componentProps() {
      return {
        actions: this.actions,
        scriptType: this.scryptType
      };
    },
    unassigned() {
      return {
        key: "",
        value: "unassigned"
      };
    }
  }
};
</script>
