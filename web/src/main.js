import Vue from 'vue';
import './plugins/icons';
import vuetify from './plugins/vuetify';
import './plugins/script2';
import './plugins/clipboard';
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify,
}).$mount('#app')
