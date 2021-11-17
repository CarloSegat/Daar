import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import store from '@/store'
import SignIn from '@/views/SignIn.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'SignIn',
        component: SignIn,
    },
    {
        path: '/account',
        name: 'AccountCreation',
        component: () => import('@/views/AccountCreation.vue'),
    },
    {
        path: '/accountViewer',
        name: 'AccountViewer',
        component: () => import('@/views/AccountViewer.vue'),
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach((to, _from, next) => {
    if (to.name !== 'SignIn' && !store.state.account.address) {
        next({name: 'SignIn'})
        console.log("redirecting?")
    } else {
        next()
    }
})

export default router
