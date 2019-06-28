import Vue from 'vue'
import Vuetify, {
} from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

import Vuex from 'vuex'
Vue.use(Vuex)

import VueFeather from 'vue-feather';
Vue.use(VueFeather);

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faSave,
  faTint,
  faThermometerFull,
  faThermometerThreeQuarters,
  faThermometerHalf,
  faThermometerQuarter,
  faThermometerEmpty,
  faCloud,
  faChartArea,
  faCheck,
  faBan,
  faEye,
  faEyeSlash,
  faTrashAlt,
  faBatteryFull,
  faBatteryThreeQuarters,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryEmpty,
  faDatabase,
  faLink,
  faWarehouse,
  faVideo,
  faAngleDoubleRight,
  faLightbulb,
  faToggleOn,
  faPlug,
  faExclamationTriangle,
  faSun,
  faCode,
  faBolt,
  faExclamation,
  faTrash,
  faBell,
  faUnlockAlt,
  faKey,
  faTv,
  faVolumeUp,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

import {
  faGithub,
} from '@fortawesome/free-brands-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const icons =[
  faSave,
  faTint,
  faThermometerFull,
  faThermometerThreeQuarters,
  faThermometerHalf,
  faThermometerQuarter,
  faThermometerEmpty,
  faCloud,
  faChartArea,
  faCheck,
  faBan,
  faEye,
  faEyeSlash,
  faTrashAlt,
  faBatteryFull,
  faBatteryThreeQuarters,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryEmpty,
  faDatabase,
  faLink,
  faWarehouse,
  faGithub,
  faVideo,
  faAngleDoubleRight,
  faLightbulb,
  faToggleOn,
  faPlug,
  faExclamationTriangle,
  faSun,
  faCode,
  faBolt,
  faExclamation,
  faTrash,
  faBell,
  faUnlockAlt,
  faKey,
  faTv,
  faVolumeUp,
  faQuestionCircle];

for (var icon in icons) {
  library.add(icons[icon])
}

Vue.component('font-awesome-icon', FontAwesomeIcon)


export default new Vuetify({
  components: {
  },
  icons: {
    iconfont: 'mdiSvg' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  }
})