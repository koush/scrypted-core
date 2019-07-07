<template>
  <v-app>
    <Drawer v-model="$data"></Drawer>

    <v-app-bar dark app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="headline text-uppercase">
        <span>{{ title }}</span>
        <!-- <span class="font-weight-light">Management Console</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>notifications</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-tile v-for="n in 5" :key="n" @click="() => {}">
            <v-list-tile-item>Option {{ n }}</v-list-tile-item>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content elevation="-2">
      <v-container grid-list-xs grid-list-xl grid-list-md grid-list-sm grid-list-lg fluid>
        <v-fade-transition mode="out-in">
          <router-view v-if="!loading"></router-view>
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Device from "./components/Device.vue";
import AggregateComponent from "./components/builtin/AggregateComponent.vue";
import AutomationComponent from "./components/builtin/AutomationComponent.vue";
import WebPushComponent from "./components/builtin/WebPushComponent.vue";
import ScriptComponent from "./components/builtin/ScriptComponent.vue";
import RemoteManagementComponent from "./components/builtin/RemoteManagementComponent.vue";
import LogComponent from "./components/builtin/LogComponent.vue";
import GoogleHomeComponent from "./components/builtin/GoogleHomeComponent.vue";
import AlexaComponent from "./components/builtin/AlexaComponent.vue";
import HomeKitComponent from "./components/builtin/HomeKitComponent.vue";
import Dashboard from "./components/dashboard/Dashboard.vue";
import Drawer from "./components/Drawer.vue";
import Devices from "./components/Devices.vue";
import VueRouter from "vue-router";
import client from "@scrypted/client";

let router = new VueRouter({
  routes: [
    {
      path: "/device",
      component: Devices
    },
    {
      path: "/",
      component: Dashboard
    },
    {
      path: "/component/automation",
      component: AutomationComponent
    },
    {
      path: "/component/script",
      component: ScriptComponent
    },
    {
      path: "/component/aggregate",
      component: AggregateComponent
    },
    {
      path: "/component/webpush",
      component: WebPushComponent
    },
    {
      path: "/component/remote",
      component: RemoteManagementComponent
    },
    {
      path: "/component/home",
      component: GoogleHomeComponent
    },
    {
      path: "/component/homekit",
      component: HomeKitComponent
    },
    {
      path: "/component/alexa",
      component: AlexaComponent
    },
    {
      path: "/component/log",
      component: LogComponent
    },
    {
      path: "/component/log/:path*",
      component: LogComponent
    },
    {
      path: "/device/:id",
      component: Device
    }
  ]
});

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    systemState: {},
    scrypted: {
      devices: []
    }
  },
  mutations: {
    setSystemState: function(store, systemState) {
      store.systemState = systemState;
    },
    setDevices(store, devices) {
      store.scrypted.devices = devices;
    },
    addDevice(store, id) {
      var devices = store.scrypted.devices.filter(device => device !== id);
      devices.push(id);
      store.scrypted.devices = devices;
    },
    removeDevice(store, id) {
      store.scrypted.devices = store.scrypted.devices.filter(
        device => device !== id
      );
    }
  }
});

const PushConnectionManager = window["pushconnect"].PushConnectionManager;
var pushConnectionPromise;
Vue.prototype.$pushconnect = function() {
  if (pushConnectionPromise) {
    return pushConnectionPromise;
  }
  pushConnectionPromise = PushConnectionManager.start(
    {},
    {
      iceServers: [
        {
          urls: ["turn:n0.clockworkmod.com", "turn:n1.clockworkmod.com"],
          username: "foo",
          credential: "bar"
        }
      ]
    }
  ).then(rtcManager => {
    // console.log('persistent gcm connection created', rtcManager != null);
    // console.log(rtcManager.registrationId);
    return rtcManager;
  });

  return pushConnectionPromise;
};

export default {
  name: "App",
  components: {
    Drawer
  },
  methods: {
    hasValue(state, property) {
      return state[property] && state[property].value;
    },
    isValidDevice(id) {
      const state = this.$store.state.systemState[id];
      for (var property of ['id', 'name', 'interfaces', 'component', 'events', 'metadata', 'type']) {
        if (!this.hasValue(state, property)) {
          return false;
        }
      }
      return true;
    }
  },
  created() {
    router.beforeEach((to, from, next) => {
      this.title = to.name || "Scrypted";
      next();
    });

    const clientPromise = client.connect(null);
    Vue.use(Vue => {
      clientPromise.then(scrypted => {
        Vue.prototype.$scrypted = scrypted;
        // system state is returned as a reference and updated by the scrypted client, so passing it to vue allows direct model updates.
        // this is not the same behavior as on android. fix?
        const systemState = scrypted.systemManager.getSystemState();
        store.commit("setSystemState", systemState);
        store.commit("setDevices", Object.keys(systemState));

        scrypted.systemManager.listen(
          (eventSource, eventDetails, eventData) => {
            const id = eventSource.id;

            if (eventDetails.property === "id" && !eventData) {
              Vue.delete(systemState, id);
              store.commit("removeDevice", id);
              return;
            }

            // ensure the property is reactive
            if (eventDetails.eventInterface == "ScryptedDevice") {
              Vue.set(systemState, id, systemState[id]);
              if (this.isValidDevice(id)) {
              store.commit("addDevice", id);
              }
              return;
            }
          }
        );
        this.loading = false;
      });
    });
  },
  store,
  router,
  data() {
    return {
      title: "Scrypted",
      drawer: this.$vuetify.breakpoint.lgAndUp,
      loading: true
    };
  }
};
</script>
