import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Books from '../views/Books.vue'
import Languages from '../views/Languages.vue'
import Search from '../views/Search.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/lang',
    name: 'Languages',
    component: Languages,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/lang/:lang',
    name: 'Books',
    component: Books,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
