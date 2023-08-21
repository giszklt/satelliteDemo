import Vue from 'vue'
import App from './App.vue'
import dependUtils from "./components/index";

Vue.config.productionTip = false

Vue.use(dependUtils);
new Vue({
  render: h => h(App),
}).$mount('#app')
