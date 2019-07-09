import Vue from 'vue';

import VueFeather from 'vue-feather';
Vue.use(VueFeather);

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faInbox,
  faCopy,
  faFolderPlus,
  faPlay,
  faLockOpen,
  faUnlock,
  faLock,
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
  faInbox,
  faCopy,
  faFolderPlus,
  faPlay,
  faUnlockAlt,
  faLockOpen,
  faUnlock,
  faLock,
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

