import Vue from 'vue';
import App from './App/index.vue';
import store from './store';
import Router from '@/router';
import config from '@/config';
import localization from '@/localization';

Vue.config.productionTip = false;

// Copy to clipboard plugin
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

// Notifications
import Notifications from 'vue-notification';
Vue.use(Notifications);

// Init progress bar
import VueProgressBar from 'vue-progressbar';
Vue.use(VueProgressBar, config.progressbar);

import wysiwyg from 'vue-wysiwyg';
Vue.use(wysiwyg, {}); // config is optional. more below

export default new Vue({
  router: new Router().vueRouter,
  i18n: localization.i18n,
  store,
  render: h => h(App)
}).$mount('#app');
