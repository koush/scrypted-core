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
            <v-badge :value="$store.state.scrypted.alerts.length" color="red" overlap>
              <template v-slot:badge>{{ $store.state.scrypted.alerts.length }}</template>
              <v-icon>notifications</v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            class="font-weight-light"
            v-for="alert in $store.state.scrypted.alerts"
            :key="alert.id"
            @click="doAlert(alert)"
          >
            <v-list-item-icon>
              <font-awesome-icon size="sm" :icon="alert.icon" style="color: #a9afbb;" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="caption">{{ alert.title }}</v-list-item-title>
              <v-list-item-subtitle class="caption">{{ alert.message }}</v-list-item-subtitle>
              <v-list-item-subtitle class="caption">{{ friendlyTime(alert.timestamp) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="$store.state.scrypted.alerts.length"></v-divider>
          <v-list-item v-if="!$store.state.scrypted.alerts.length" class="font-weight-light">
            <v-list-item-content>
              <v-list-item-title class="caption">No notifications.</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else class="font-weight-light" @click="clearAlerts">
            <v-list-item-icon>
              <font-awesome-icon size="sm" icon="trash" style="color: #a9afbb;" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="caption">Clear All Alerts</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text style="margin-right: 24px;">{{$store.state.username}}</v-btn>
        </template>
        <v-list>
          <v-list-item class="font-weight-light" @click="logout">
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-dialog
      v-if="$store.state.isLoggedIntoCloud === false"
      :value="true"
      persistent
      max-width="600px"
    >
      <v-card dark color="purple">
        <v-card-title>
          <span class="headline">Scrypted Management Console</span>
        </v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="doCloudLogin">Log Into Scrypted Cloud</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-else-if="$store.state.isLoggedIn === false"
      :value="true"
      persistent
      max-width="600px"
    >
      <v-card dark color="purple">
        <v-card-title>
          <span class="headline">Scrypted Management Console</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="username" color="white" label="User Name"></v-text-field>
                <v-text-field v-model="password" color="white" type="password" label="Password"></v-text-field>
                <v-checkbox
                  v-if="$store.state.hasLogin === true"
                  v-model="changePassword"
                  label="Change Password"
                ></v-checkbox>
                <v-text-field
                  v-model="confirmPassword"
                  v-if="changePassword || $store.state.hasLogin === false"
                  color="white"
                  type="password"
                  label="Confirm Password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <div>{{ loginResult }}</div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="doLogin">Log In</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-else-if="$store.state.isConnected === false"
      :value="true"
      persistent
      max-width="600px"
    >
      <v-card dark color="purple">
        <v-card-title>
          <span class="headline">Scrypted Management Console</span>
        </v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$connectScrypted">Reconnect</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-content elevation="-2">
      <v-container grid-list-xs grid-list-xl grid-list-md grid-list-sm grid-list-lg fluid>
        <v-fade-transition mode="out-in">
          <router-view v-if="!$store.state.isConnecting"></router-view>
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import qs from "query-string";
import axios from "axios";
import Device from "./components/Device.vue";
import AggregateComponent from "./components/aggregate/AggregateComponent.vue";
import AutomationComponent from "./components/automation/AutomationComponent.vue";
import WebPushComponent from "./components/webpush/WebPushComponent.vue";
import ScriptComponent from "./components/script/ScriptComponent.vue";
import InstallPlugin from "./components/script/InstallPlugin.vue";
import RemoteManagementComponent from "./components/builtin/RemoteManagementComponent.vue";
import LogComponent from "./components/builtin/LogComponent.vue";
import GoogleHomeComponent from "./components/builtin/GoogleHomeComponent.vue";
import AlexaComponent from "./components/builtin/AlexaComponent.vue";
import HomeKitComponent from "./components/builtin/HomeKitComponent.vue";
import MailComponent from "./components/mail/MailComponent.vue";
import SettingsComponent from "./components/builtin/SettingsComponent.vue";
import Zwave from "./components/zwave/Zwave.vue";
import Dashboard from "./components/dashboard/Dashboard.vue";
import Drawer from "./components/Drawer.vue";
import Devices from "./components/Devices.vue";
import VueRouter from "vue-router";
import client from "@scrypted/client";
import { removeAlert } from "./components/helpers";

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
      path: "/component/script/install",
      component: InstallPlugin
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
      path: "/component/settings",
      component: SettingsComponent
    },
    {
      path: "/component/mail",
      component: MailComponent
    },
    {
      path: "/component/zwave",
      component: Zwave,
      children: Zwave.childRoutes
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
      devices: [],
      alerts: []
    },
    username: undefined,
    isLoggedIn: undefined,
    isLoggedIntoCloud: undefined,
    isConnected: undefined,
    hasLogin: undefined
  },
  mutations: {
    setSystemState: function(store, systemState) {
      store.systemState = systemState;
    },
    setDevices(store, devices) {
      store.scrypted.devices = devices;
    },
    setAlerts(store, alerts) {
      store.scrypted.alerts = alerts;
    },
    removeAlert(store, alertId) {
      store.scrypted.alerts = store.scrypted.alerts.filter(
        alert => alert.id != alertId
      );
    },
    addAlert(store, alert) {
      const alerts = store.scrypted.alerts.filter(
        existing => existing.id != alert.id
      );
      alerts.push(alert);
      store.scrypted.alerts = alerts;
    },
    addDevice(store, id) {
      console.log("new device added");
      var devices = store.scrypted.devices.filter(device => device !== id);
      devices.push(id);
      store.scrypted.devices = devices;
    },
    removeDevice(store, id) {
      console.log("device removed");
      store.scrypted.devices = store.scrypted.devices.filter(
        device => device !== id
      );
    },
    setIsLoggedIntoCloud(store, isLoggedIntoCloud) {
      store.isLoggedIntoCloud = isLoggedIntoCloud;
    },
    setIsLoggedIn(store, isLoggedIn) {
      store.isLoggedIn = isLoggedIn;
    },
    setUsername(store, username) {
      store.username = username;
    },
    setIsConnected(store, isConnected) {
      store.isConnected = isConnected;
    },
    setHasLogin(store, hasLogin) {
      store.hasLogin = hasLogin;
    }
  }
});

function hasValue(state, property) {
  return state[property] && state[property].value;
}
function isValidDevice(id) {
  const state = store.state.systemState[id];
  for (var property of [
    "id",
    "name",
    "interfaces",
    "component",
    "events",
    "metadata",
    "type"
  ]) {
    if (!hasValue(state, property)) {
      return false;
    }
  }
  return true;
}

Vue.use(Vue => {
  Vue.prototype.$connectScrypted = () => {
    const clientPromise = client.connect(null);

    store.commit("setHasLogin", undefined);
    store.commit("setIsLoggedIn", undefined);
    store.commit("setUsername", undefined);
    store.commit("setIsConnected", undefined);
    store.commit("setIsLoggedIntoCloud", undefined);

    axios
      .get("/login", {
        headers: {
          Accept: "application/json"
        }
      })
      .then(response => {
        if (!response.data.expiration) {
          if (response.data.redirect) {
            store.commit("setIsLoggedIntoCloud", false);
          }
          store.commit("setHasLogin", response.data.hasLogin);
          throw new Error("Login failed.");
        }
        store.commit("setHasLogin", true);
        store.commit("setIsLoggedIn", true);
        store.commit("setUsername", response.data.username);
        setTimeout(() => {
          store.commit("setIsLoggedIn", false);
        }, response.data.expiration);
        return clientPromise;
      })
      .catch(e => {
        store.commit("setIsLoggedIn", false);
        throw e;
      })
      .then(scrypted => {
        Vue.prototype.$scrypted = scrypted;
        // system state is returned as a reference and updated by the scrypted client, so passing it to vue allows direct model updates.
        // this is not the same behavior as on android. fix?
        const systemState = scrypted.systemManager.getSystemState();
        store.commit("setSystemState", systemState);
        store.commit("setDevices", Object.keys(systemState));
        store.commit("setIsConnected", true);

        scrypted.onClose = () => {
          store.commit("setIsConnected", false);
        };

        scrypted.systemManager.listen(
          (eventSource, eventDetails, eventData) => {
            if (eventSource) {
              const id = eventSource.id;

              if (eventDetails.property === "id" && !eventData) {
                Vue.delete(systemState, id);
                store.commit("removeDevice", id);
                return;
              }

              // ensure the property is reactive
              if (eventDetails.eventInterface == "ScryptedDevice") {
                Vue.set(systemState, id, systemState[id]);
                if (isValidDevice(id)) {
                  store.commit("addDevice", id);
                }
                return;
              }
            } else if (eventDetails.eventInterface == "Logger") {
              store.commit("addAlert", eventData);
            }
          }
        );

        scrypted.rpc("alerts").then(alerts => {
          store.commit("setAlerts", alerts);
        });
      })
      .catch(() => {
        store.commit("setIsConnected", false);
      });
  };

  Vue.prototype.$connectScrypted();
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
  mounted() {
    this._timer = setInterval(
      function() {
        this.$data.now = Date.now();
      }.bind(this),
      1000
    );
  },
  destroyed: function() {
    clearInterval(this._timer);
  },
  methods: {
    logout() {
      axios.get("/logout").then(() => window.location.reload());
    },
    doCloudLogin() {
      var encode = qs.stringify({
        redirect_uri: "/endpoint/@scrypted/core/public/"
      });

      window.location = `https://home.scrypted.app/_punch/login?${encode}`;
    },
    doLogin() {
      const body = {
        username: this.username,
        password: this.password
      };
      if (this.changePassword || this.$store.state.hasLogin === false) {
        if (this.password !== this.changePassword) {
          return;
        }
        body.changePassword = this.changePassword;
      }

      axios
        .post("/login", qs.stringify(body), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        .then(response => {
          if (response.data.error) {
            this.loginResult = response.data.error;
            return;
          }
          window.location.reload();
        });
    },
    clearAlerts() {
      this.$scrypted.rpc("removeAlerts").then(() => {
        this.$store.commit("setAlerts", []);
      });
    },
    removeAlert,
    doAlert(alert) {
      const alertPath = alert.path.replace("/web/", "/");
      this.removeAlert(alert);
      this.$router.push(alertPath);
    },
    friendlyTime(timestamp) {
      var date = new Date(parseFloat(timestamp));

      var seconds = Math.floor((this.now - date) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years ago";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months ago";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days ago";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours ago";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
    },
    alertConvert(alertPath) {
      return alertPath.replace("/web/", "/");
    }
  },
  created() {
    router.beforeEach((to, from, next) => {
      this.title = to.name || "Scrypted";
      next();
    });
  },
  store,
  router,
  data() {
    const self = this;
    return {
      now: 0,
      title: "Scrypted",
      drawer: this.$vuetify.breakpoint.lgAndUp,
      changePassword: false,
      username: null,
      password: null,
      confirmPassword: null,
      loginResult: undefined,
      passwordRules: [
        () => {
          if (self.password != self.confirmPassword && self.changePassword) {
            return "Passwords do not match.";
          }
          return true;
        }
      ]
    };
  }
};
</script>
