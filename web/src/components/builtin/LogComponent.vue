<template>
  <v-flex xs12>
    <v-card raised color="blue" dark>
      <v-card-title>
        Logs
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        light
        :headers="headers"
        :items="logs"
        disable-sort
        :items-per-page="500"
        :search="search"
      >
        <template v-slot:item.pri="{ item }">
          <v-chip x-small :color="priToColor(item.pri)">{{ item.pri }}</v-chip>
        </template>
        <template v-slot:item.tag="{ item }">
          <a :href="`#/${item.tag.replace('Scrypted/', 'component/log/')}`">{{item.title}}</a>
        </template>
        <template v-slot:item.log="{ item }">
          <pre class="caption">{{ item.log }}</pre>
          <div class="caption font-weight-light">
            <a :href="`${(item.path || '/').replace('/web', '#')}`">{{ item.title }}</a>
          </div>
          <div v-if="item.t">
            <div>{{ item.t }}</div>
            <pre class="caption">{{ item.ts }}</pre>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>
</template>
<script>
const eio = require("engine.io-client");

export default {
  props: {},
  eioSocket: null,
  watch: {
    $route: {
      deep: true,
      handler() {
        this.disconnect();
        this.connect();
      }
    }
  },
  data() {
    return {
      search: "",
      logs: [],
      headers: [
        {
          text: "Time",
          value: "date",
          width: 40
        },
        {
          text: "Priority",
          value: "pri",
          width: 40
        },
        {
          text: ".",
          value: "tag",
          width: 80
        },
        {
          text: "Message",
          value: "log"
        }
      ]
    };
  },
  methods: {
    priToColor(pri) {
      switch (pri) {
        case "E":
          return "error";
        case "I":
          return "info";
        case "W":
          return "warning";
        case "V":
          return "success";
      }
    },
    connect() {
      var eioLocation =
        window.location.hash.replace(
          "#/component/log",
          "/web/component/log/json"
        ) + "/engine.io";
      var address = window.location.protocol + "//" + window.location.host;
      var socket = (this.eioSocket = new eio.Socket(address, {
        path: eioLocation
      }));

      socket.on("open", () => {
        socket.on("message", str => {
          this.logs.unshift(JSON.parse(str));
        });
        socket.on("close", () => {});
      });
    },
    disconnect() {
      if (this.eioSocket) {
        this.eioSocket.close();
      }
      this.logs = [];
    }
  },
  destroyed() {
    this.disconnect();
  },
  mounted() {
    this.connect();
  }
};
</script>