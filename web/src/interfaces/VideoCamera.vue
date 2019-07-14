<template>
  <v-dialog v-model="dialog" width="1024">
    <template v-slot:activator="{ on }">
      <a v-on="on"><v-img  contain :src="src" lazy-src="images/cameraloading.jpg"></v-img></a>
    </template>
    <video ref="video" width="100%" style="background-color: black;" playsinline autoplay></video>
  </v-dialog>
</template>

<script>
import RPCInterface from "./RPCInterface.vue";

var currentStream;

const scryptedServerVariables = {};
scryptedServerVariables.registrationId = "web:/web/message";
scryptedServerVariables.senderId = null;
scryptedServerVariables.apiKey = "AIzaSyCBbKhH_IM1oIZMOO65xOnzgDDrmC2lAoc";

export default {
  mixins: [RPCInterface],
  data() {
    return {
      src: "images/cameraloading.jpg",
      dialog: false,
    };
  },
  watch: {
    dialog(val) {

      if (!val) {
        if (currentStream) {
          currentStream.then(connection => connection.destroy());
        }
        return;
      }

      this.$pushconnect().then(rtcManager => {
        const rtspUrl = `camera://${this.device.id}`;

        currentStream = rtcManager.connect({
          senderId: scryptedServerVariables.senderId,
          registrationId: scryptedServerVariables.registrationId,
          port: rtspUrl,
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 1
        });

        currentStream.then(conn => {
          var video = this.$refs.video;
          var mediaStream = new MediaStream();
          mediaStream.addTrack(conn.peerConnection.getReceivers()[1].track);
          video.srcObject = mediaStream;
        });
      });
    }
  },
  mounted() {
    const videoStream = this.device.getVideoStream();
    this.$scrypted.mediaManager
      .convertMediaObjectToLocalUri(videoStream, "image/jpeg")
      .then(result => {
        this.picture = true;
        const url = new URL(result);
        this.src = url.pathname;
      });
  }
};
</script>
