<template>
  <GmapMap :center="center" :zoom="16" ref="mapRef" style="height: 400px">
    <GmapMarker
      :key="index"
      v-for="(position, index) in markers"
      :position="position"
      :label="position.label"
    />
  </GmapMap>
</template>
<script>
import DashboardBase from "./DashboardBase";

export default {
  mixins: [DashboardBase],
  props: ["type", "group"],
  mounted() {
    this.$refs.mapRef.$mapPromise.then(map => {
      var markers = this.markers; //some array
      var bounds = new google.maps.LatLngBounds();
      var fits = true;
      for (var i = 0; i < markers.length; i++) {
        if (!map.getBounds().contains(markers[i])) {
          bounds.extend(markers[i]);
          fits = false;
        }
      }
      if (!fits) {
        map.fitBounds(bounds);
      }
      if (!map.getZoom() || map.getZoom() > 16) {
        map.setZoom(16);
      }
    });
  },
  computed: {
    center() {
      var lat = 0;
      var lng = 0;
      for (var marker of this.markers) {
        lat += marker.lat;
        lng += marker.lng;
      }

      lat /= this.markers.length;
      lng /= this.markers.length;
      return {
        lat,
        lng
      };
    },
    markers() {
      return this.type.ids.map(id => {
        const device = this.getDevice(id);
        var position = device.position;
        return {
          lat: position.latitude,
          lng: position.longitude,
          label: device.name
        };
      });
    }
  }
};
</script>