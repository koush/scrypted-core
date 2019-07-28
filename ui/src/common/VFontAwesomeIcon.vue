<template>
  <font-awesome-icon
  :style="{width: dimension, height: dimension}"
    :size="size"
    :icon="icon"
    :color="vuetifyColor"
  ></font-awesome-icon>
</template>
<script>
import colors from "vuetify/es5/util/colors";

// const emMap = {
//   xs: ".75em",
//   sm: ".875em",
//   lg: "1.33em",
//   "2x": "2em",
//   "3x": "3em",
//   "4x": "4em",
// };
const emMap = {
  xs: ".75em",
  sm: "1.1em",
  lg: "1.5em",
  "2x": "2em",
  "3x": "3em",
  "4x": "4em",
};
const sizeMap = {
  "x-small": "xs",
  small: "sm",
  medium: "lg",
  large: "2x",
  "x-large": "3x"
};

const props = Object.keys(sizeMap);
props.push("color", "icon");

export default {
  props,
  computed: {
    size() {
      for (var size of Object.keys(sizeMap)) {
        if (this[size] !== undefined) {
          return sizeMap[size];
        }
      }
      return sizeMap.medium;
    },
    vuetifyColor() {
      var c = colors[this.color];
      if (c) {
        return c.base;
      }
      return this.color;
    },
    dimension() {
      return emMap[this.size];
    }
  }
};
</script>