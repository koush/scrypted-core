<template>
  <GmapMap
    :center="position"
    :zoom="16"
    ref="mapRef"
    style="height: 400px"
    :options="{
   mapTypeControl: false,
   fullscreenControl: false,
 }"
  >
    <GmapMarker
      :position="position"
      :label="lazyValue.name"
    />
  </GmapMap>
</template>

<script>
import RPCInterface from "../RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  computed: {
      position() {
          return {
              lat: this.lazyValue.position.latitude,
              lng: this.lazyValue.position.longitude,
          }
      }
  }
};
</script>