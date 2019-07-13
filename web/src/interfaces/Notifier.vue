<template>
  <v-form>
    <v-container>
      <v-layout>
        <v-flex xs12>
          <v-text-field
            label="Notification Title"
            outlined
            v-model="lazyValue.notificationTitle"
            @input="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Body"
            outlined
            v-model="lazyValue.notificationBody"
            @input="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Media URL"
            outlined
            v-model="lazyValue.notificationMediaUrl"
            @input="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Media Mime Type"
            outlined
            v-model="lazyValue.notificationMediaMime"
            @input="onChange"
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
  methods: {
    ensureString(str, def) {
      return str === undefined ? def : str;
    },
    update: function(modelUpdate) {
      if (this.lazyValue.notificationMediaUrl.length) {
        this.rpc({
          modelUpdate,
        }).sendNotification(
          this.lazyValue.notificationTitle,
          this.lazyValue.notificationBody,
          this.lazyValue.notificationMediaUrl,
          this.lazyValue.notificationMediaMime
        );
      } else {
        this.rpc({
          modelUpdate
        }).sendNotification(this.lazyValue.notificationTitle, this.lazyValue.notificationBody);
      }
    },
    onChange: function() {
      this.lazyValue.notificationTitle = this.ensureString(this.lazyValue.notificationTitle, "Scrypted Notification");
      this.lazyValue.notificationBody = this.ensureString(this.lazyValue.notificationBody, "This is a message from Scrypted");
      this.lazyValue.notificationMediaUrl = this.ensureString(this.lazyValue.notificationMediaUrl, "https://home.scrypted.app/_punch/web_hi_res_512.png");
      this.lazyValue.notificationMediaMime = this.ensureString(this.lazyValue.notificationMediaMime, "image/png");
      this.update(true);
    },
    send: function() {
      this.update(false);
    }
  }
};
</script>
