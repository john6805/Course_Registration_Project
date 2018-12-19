import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  connection: 'http://localhost:8012/'
}))

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
