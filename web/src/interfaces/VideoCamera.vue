<template>
    <div class="card form-group col-12">
        <video ref='video' width="100%" style="background-color: black;" playsinline autoplay></video>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    mounted() {
        var video = this.$refs.video;
        video.addEventListener('loadedmetadata', function() {
            console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
        });

        video.addEventListener('resize', () => {
            console.log(`Remote video size changed to ${video.videoWidth}x${video.videoHeight}`);
        });

        var rtspUrl = `camera://${this.device}`;

        startRTC().then(function(rtcManager) {
            rtcManager.connect({
                senderId: scryptedServerVariables.senderId,
                registrationId: scryptedServerVariables.registrationId,
                port: rtspUrl,
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1,
            })
            .then(function(conn, e) {
                console.log('connected', conn);
                var mediaStream = new MediaStream();
                mediaStream.addTrack(conn.peerConnection.getReceivers()[1].track);
                video.srcObject = mediaStream;
            });
        })
    }
};
</script>
