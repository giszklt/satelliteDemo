
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import config from "../public/config";
import api from "./request/api.js";
import depend from "@/utils/utilsExport.js";
import dependUtils from "./utils/index";
Vue.prototype.$X = {config};
Vue.prototype.$api = api;
Vue.prototype.Cesium = Cesium;

Vue.use(dependUtils);
Vue.use(depend);
Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')



