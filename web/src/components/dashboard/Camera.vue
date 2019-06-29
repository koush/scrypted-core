<template>
  <div>
    <a @click="dialog = true">
      <v-img contain :src="src" lazy-src="images/cameraloading.jpg"></v-img>
    </a>

    <v-dialog v-model="dialog" width="1024">
      <video ref="video" width="100%" style="background-color: black;" playsinline autoplay></video>
    </v-dialog>
  </div>
</template>
<script>
var currentStream;

const scryptedServerVariables = {};
scryptedServerVariables.registrationId = "web:/web/message";
scryptedServerVariables.senderId = null;
scryptedServerVariables.apiKey = "AIzaSyCBbKhH_IM1oIZMOO65xOnzgDDrmC2lAoc";

export default {
  props: ["type", "deviceId"],
  data() {
    return {
      src: undefined,
      overlay: false,
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
        const rtspUrl = `camera://${this.deviceId}`;

        currentStream = rtcManager
          .connect({
            senderId: scryptedServerVariables.senderId,
            registrationId: scryptedServerVariables.registrationId,
            port: rtspUrl,
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
          });

          currentStream
          .then(conn => {
            var video = this.$refs.video;
            var mediaStream = new MediaStream();
            mediaStream.addTrack(conn.peerConnection.getReceivers()[1].track);
            video.srcObject = mediaStream;
          });
      });
    }
  },
  mounted() {
      const device = this.$scrypted.systemManager.getDeviceById(this.deviceId);
      const videoStream = device.getVideoStream();
      this.$scrypted.mediaManager
        .convertMediaObjectToLocalUri(videoStream, "image/png")
        .then(result => {
          const url = new URL(result);
          this.src = url.pathname;
        });
  }
};
</script>
