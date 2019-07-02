<template>
    <div class="card">
        <div class="card-body">
            <div class="form-group">
                <label for="notificationTitle">Notification Title</label>
                <input class="form-control" v-model="notificationTitle" @change='onChange'>
            </div>
            <div class="form-group">
                <label>Notification Body</label>
                <input class="form-control" v-model="notificationBody" @change='onChange'>
            </div>
            <div class="form-group">
                <label>Notification Media URL</label>
                <input class="form-control" v-model="notificationMediaUrl" @change='onChange'>
            </div>
            <div class="form-group">
                <label>Notification Media Mime Type</label>
                <input class="form-control" v-model="notificationMediaMime" @change='onChange'>
            </div>

            <div v-if="device" class="form-group">
                <button class="btn btn-success" v-on:click="send">Send</button>
            </div>
        </div>
    </div>
</template>

<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    mounted: function() {
        // sync up the defaults with the model
        Object.assign(this.value, this.$data);
        this.update(true);
    },
    data: function() {
        return {
            notificationTitle: this.value.notificationTitle !== undefined ? this.value.notificationTitle : 'Scrypted Notification',
            notificationBody: this.value.notificationBody !== undefined ? this.value.notificationBody : 'This is a message from Scrypted',
            notificationMediaUrl: this.value.notificationMediaUrl !== undefined ? this.value.notificationMediaUrl : 'https://home.scrypted.app/_punch/web_hi_res_512.png',
            notificationMediaMime: this.value.notificationMediaMime !== undefined ? this.value.notificationMediaMime : 'image/png',
        }
    },
    methods: {
        update: function(modelUpdate) {
            Object.assign(this.value, this.$data);

            if (this.notificationMediaUrl.length) {
                this.rpc({
                    modelUpdate
                }).sendNotification(
                        this.notificationTitle,
                        this.notificationBody,
                        this.notificationMediaUrl,
                        this.notificationMediaMime,
                );
            }
            else {
                this.rpc({
                    modelUpdate
                }).sendNotification(
                        this.notificationTitle,
                        this.notificationBody,
                );
            }

        },
        onChange: function() {
            this.update(true);
        },
        send: function() {
            this.update(false);
        },
    }
};
</script>
