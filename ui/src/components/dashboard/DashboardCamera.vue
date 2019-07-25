<template>
  <div>
    <!-- <div>{{$store.state.systemState[value.deviceId].name.value}}</div> -->
    <a @click="dialog = true">
      <v-img contain :src="src" lazy-src="images/cameraloading.jpg"></v-img>
    </a>

    <v-dialog v-model="dialog" width="1024">
      <video
        v-if="video"
        ref="video"
        width="100%"
        style="background-color: black;"
        playsinline
        autoplay
      ></video>
      <v-img v-else contain :src="src" lazy-src="images/cameraloading.jpg"></v-img>
    </v-dialog>
  </div>
</template>
<script>
import { ScryptedInterface } from "@scrypted/sdk";
var currentStream;

const scryptedServerVariables = {};
scryptedServerVariables.registrationId = "web:/web/message";
scryptedServerVariables.senderId = null;
scryptedServerVariables.apiKey = "AIzaSyCBbKhH_IM1oIZMOO65xOnzgDDrmC2lAoc";

export default {
  name: "DashboardCamera",
  props: ["value"],
  data() {
    return {
      video: false,
      src: undefined,
      overlay: false,
      dialog: false
    };
  },
  watch: {
    dialog(val) {
      if (!this.video) {
        return;
      }

      if (!val) {
        if (currentStream) {
          currentStream.then(connection => connection.destroy());
        }
        return;
      }

      this.$pushconnect().then(rtcManager => {
        const rtspUrl = `camera://${this.value.deviceId}`;

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
    const device = this.$scrypted.systemManager.getDeviceById(
      this.value.deviceId
    );
    if (device.interfaces.includes(ScryptedInterface.VideoCamera)) {
      this.video = true;
      const videoStream = device.getVideoStream();
      this.$scrypted.mediaManager
        .convertMediaObjectToLocalUri(videoStream, "image/jpeg")
        .then(result => {
          const url = new URL(result);
          this.src = url.pathname;
        })
        .catch(() => {
          this.src = "images/cameraloading.jpg";
        });
    } else {
      const picture = device.takePicture();
      this.$scrypted.mediaManager
        .convertMediaObjectToLocalUri(picture, "image/jpeg")
        .then(result => {
          const url = new URL(result);
          this.src = url.pathname;
        })
        .catch(() => {
          this.src = "images/cameraloading.jpg";
        });
    }
  }
};
</script>
