import Vue from 'vue'
import VueSpinners from 'vue-spinners'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueSpinners);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
