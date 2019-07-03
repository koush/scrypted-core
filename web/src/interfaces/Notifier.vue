<template>
  <v-form>
    <v-container>
      <v-layout>
        <v-flex xs12>
          <v-text-field
            label="Notification Title"
            outlined
            v-model="notificationTitle"
            @change="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Body"
            outlined
            v-model="notificationBody"
            @change="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Media URL"
            outlined
            v-model="notificationMediaUrl"
            @change="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Media Mime Type"
            outlined
            v-model="notificationMediaMime"
            @change="onChange"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import RPCInterface from "./RPCInterface.vue";

export default {
  mixins: [RPCInterface],
  mounted: function() {
    // sync up the defaults with the model
    Object.assign(this.value, this.$data);
    this.update(true);
  },
  data: function() {
    return {
      notificationTitle:
        this.value.notificationTitle !== undefined
          ? this.value.notificationTitle
          : "Scrypted Notification",
      notificationBody:
        this.value.notificationBody !== undefined
          ? this.value.notificationBody
          : "This is a message from Scrypted",
      notificationMediaUrl:
        this.value.notificationMediaUrl !== undefined
          ? this.value.notificationMediaUrl
          : "https://home.scrypted.app/_punch/web_hi_res_512.png",
      notificationMediaMime:
        this.value.notificationMediaMime !== undefined
          ? this.value.notificationMediaMime
          : "image/png"
    };
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
          this.notificationMediaMime
        );
      } else {
        this.rpc({
          modelUpdate
        }).sendNotification(this.notificationTitle, this.notificationBody);
      }
    },
    onChange: function() {
      this.update(true);
    },
    send: function() {
      this.update(false);
    }
  }
};
</script>
