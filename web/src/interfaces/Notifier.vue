<template>
  <v-form>
    <v-container>
      <v-layout>
        <v-flex xs12>
          <v-text-field
            label="Notification Title"
            outlined
            v-model="model.notificationTitle"
            @input="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Body"
            outlined
            v-model="model.notificationBody"
            @input="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Media URL"
            outlined
            v-model="model.notificationMediaUrl"
            @input="onChange"
          ></v-text-field>
          <v-text-field
            label="Notification Media Mime Type"
            outlined
            v-model="model.notificationMediaMime"
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
  data: function() {
    return {
      model: this.cloneValue(),
    };
  },
  methods: {
    ensureString(str, def) {
      return str === undefined ? def : str;
    },
    update: function(modelUpdate) {
      if (this.model.notificationMediaUrl.length) {
        this.rpc({
          modelUpdate,
        }).sendNotification(
          this.model.notificationTitle,
          this.model.notificationBody,
          this.model.notificationMediaUrl,
          this.model.notificationMediaMime
        );
      } else {
        this.rpc({
          modelUpdate
        }).sendNotification(this.notificationTitle, this.notificationBody);
      }
    },
    onChange: function() {
      this.model.notificationTitle = this.ensureString(this.model.notificationTitle, "Scrypted Notification");
      this.model.notificationBody = this.ensureString(this.model.notificationBody, "This is a message from Scrypted");
      this.model.notificationMediaUrl = this.ensureString(this.model.notificationMediaUrl, "https://home.scrypted.app/_punch/web_hi_res_512.png");
      this.model.notificationMediaMime = this.ensureString(this.model.notificationMediaMime, "image/png");
      this.update(true);
    },
    send: function() {
      this.update(false);
    }
  }
};
</script>
