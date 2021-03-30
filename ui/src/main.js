import Vue from 'vue';
import './plugins/icons';
import vuetify from './plugins/vuetify';
import './plugins/script2';
import './plugins/clipboard';
import './plugins/maps';
import './plugins/async-computed';
import App from './App.vue'
import './registerServiceWorker'
import linkify from 'vue-linkify'

Vue.directive('linkified', linkify)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify,
}).$mount('#app')
