
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

var poopy = 34;

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
      var devices = store.scrypted.devices.filter(device => device !== id);
      devices.push(id);
      store.scrypted.devices = devices;
    },
    removeDevice(store, id) {
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

export default store;