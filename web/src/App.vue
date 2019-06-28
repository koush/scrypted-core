<template>
  <v-app>
    <Drawer v-model="$data"></Drawer>
    
    <v-app-bar dark app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="headline text-uppercase">
        <span>{{ title }} </span>
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

    <v-content>
      <v-container grid-list-xs grid-list-xl grid-list-md grid-list-sm grid-list-lg fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
// import Dashboard from './components/Dashboard';
import Dashboard from './components/dashboard/Dashboard.vue';
import Drawer from './components/Drawer.vue';
import Devices from './components/Devices.vue';
import VueRouter from 'vue-router'
let router = new VueRouter({
  routes: [
    {
      path: '/devices',
      component:  Devices,
    },
    {
      path: '/',
      component:  Dashboard,
    }
  ]
});

import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    systemState: {},
  },
  mutations: {
    setSystemState: function(store, systemState) {
      store.systemState = systemState;
    }
  }
})

const PushConnectionManager = window['pushconnect'].PushConnectionManager;
var pushConnectionPromise;
Vue.prototype.$pushconnect = function() {
  if (pushConnectionPromise) {
    return pushConnectionPromise;
  }
  pushConnectionPromise = PushConnectionManager.start({},
  {
    iceServers: [
      {
        urls: ["turn:n0.clockworkmod.com", "turn:n1.clockworkmod.com"],
        username: "foo",
        credential: "bar"
      },
    ],
  })
  .then(rtcManager => {
    console.log('persistent gcm connection created', rtcManager != null);
    console.log(rtcManager.registrationId);
    return rtcManager;
  });

  return pushConnectionPromise;
};



import client from '@scrypted/client';

const clientPromise = client.connect(null);
Vue.use((Vue) => {
  clientPromise.then(scrypted => {
    Vue.prototype.$scrypted = scrypted;
    const systemState = scrypted.systemManager.getSystemState();
    store.commit('setSystemState', systemState);

    scrypted.systemManager.listen((eventSource, eventDetails, eventData) => {
      if (!eventDetails.property) {
          return;
      }

      const device = systemState[eventSource.id] = systemState[eventSource.id] || {};
      var state = device[eventDetails.property] = device[eventDetails.property] || {};
      Object.assign(state, {
          stateTime: state.value !== eventData ? eventDetails.eventTime : state.lastEventTime,
          lastEventTime: eventDetails.eventTime,
          sourceInterface: eventDetails.eventInterface,
          value: eventData,
      });
    });
  });
});

export default {
  name: "App",
  components: {
    Drawer,
  },
  created() {
    router.beforeEach((to, from, next) => {
      this.title = to.name || "Scrypted";
      next();
    })
  },
  store,
  router,
  data() {
    return {
      title: 'Scrypted',
      drawer: false,
    };
  }
};
</script>
