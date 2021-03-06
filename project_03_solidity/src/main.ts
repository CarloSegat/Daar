import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/main.css';

function truncateEth(address: string, _len: number) {
    if (!address) {
        return ""
    }
    const len = _len | 4;

    let prefix = address.slice(0, len)
    if (address.slice(0, 2).toLowerCase() === '0x') {
        prefix = address.slice(0, len + 2)
    }
    const suffix = address.slice(address.length - len, address.length)
    return prefix + '...' + suffix;
}

function weiToEth(wei: number) {
    return wei / (10 ** 18);
}

function openSelectedProject(p: any, router: any) {

   router.push({
        name: 'SingleProjectView',
        params: {
            name: p.name,
            mission: p.mission,
            balance: p.balance,
            id: p.id,
            owner: p.owner,
            contributors: p.contributors
        }
    })
}

const globals = {
    methods: {
        "truncateEth": truncateEth,
        "weiToEth": weiToEth,
        "openSelectedProject": openSelectedProject,
    },
}

const app = createApp(App);
app.use(store)
    .use(router)
    .mount('#app')

app.mixin(globals)
