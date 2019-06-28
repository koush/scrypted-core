<template>
  <div>
    <a @click="launch(id)" v-for="id in type.ids" :key="id">
      <v-img contain :src="blobs[id]"></v-img>
    </a>

    <v-dialog v-model="dialog" width="1024">
      <v-card>
        <video ref="video" width="100%" style="background-color: black;" playsinline autoplay></video>
      </v-card>
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
  props: ["type"],
  data() {
    const blobs = {};
    this.type.ids.forEach(id => {
      blobs[id] = "https://cdn.vuetifyjs.com/images/lists/ali.png";
    });
    return {
      blobs,
      overlay: false,
      dialog: false,
      currentCamera: undefined
    };
  },
  methods: {
    launch(id) {
      this.dialog = true;
      this.currentCamera = id;
    }
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
        if (!this.currentCamera) {
          return;
        }
        const rtspUrl = `camera://${this.currentCamera}`;

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

            console.log("connected", conn);
            var mediaStream = new MediaStream();
            mediaStream.addTrack(conn.peerConnection.getReceivers()[1].track);
            video.srcObject = mediaStream;
          });
      });
    }
  },
  mounted() {
    this.type.ids.forEach(id => {
      const device = this.$scrypted.systemManager.getDeviceById(id);
      const videoStream = device.getVideoStream();
      this.$scrypted.mediaManager
        .convertMediaObjectToUri(videoStream, "image/png")
        .then(result => {
          // const blob = new Blob([result], {
          //     type: 'image/png'
          // });
          // const url = window.URL.createObjectURL(blob);
          // this.$data.src = url;
          this.blobs[id] = result;
        });
    });
  }
};
</script>
