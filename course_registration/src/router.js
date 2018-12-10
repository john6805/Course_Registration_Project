import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home/:authenticated/:university_id',
      name: 'home',
      component: Home,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
