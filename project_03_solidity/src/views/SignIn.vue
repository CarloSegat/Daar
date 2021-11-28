<template>
  <div class="home-wrapper">
    <!--  if metamask is not connected - based on address being populated  -->
    <card
        v-if="!address"
        title="It looks like you're not connected."
        subtitle="Please connect to use the app."
        :blue="true"
    >
      <collective-button :transparent="true" @collectiveClick="connect">
        Connect
      </collective-button>
    </card>

    <!--  if connected w metamask  -->
    <card title="You're connected!" subtitle="Hooray" :blue="true" v-else>
      <collective-button :transparent="true" @collectiveClick="goToAccount">
        Go to account
      </collective-button>
    </card>
    <div class="home">
      <card
          v-for="(link, index) in links"
          :key="index"
          :title="link.title"
          subtitle="To never be lost"
      >
        <a class="card-body" :href="link.link"> Find it here </a>
      </card>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue'
import {useStore} from 'vuex'
import Card from '@/components/generic/Card.vue'
import CollectiveButton from '@/components/generic/CollectiveButton.vue'

export default defineComponent({
  name: 'SignIn',
  components: {Card, CollectiveButton},
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    const registered = computed(() => store.state.registrationStatus.registered)
    const isEnterprise = computed(() => store.state.registrationStatus.isEnterprise)
    const connect = () => store.dispatch('ethereumConnect')
    const fetchRegistrationRecord = () => store.dispatch('fetchRegistrationRecord')
    return {address, connect, contract, fetchRegistrationRecord, registered, isEnterprise}
  },
  async updated() {
    await this.fetchRegistrationRecord()
    if (this.registered) {
      this.$router.push({name: 'AccountViewer'})
    }
  },
  computed: {
    links() {
      const link = (title_: string, link: string) => {
        const title = `${title_} Documentation`
        return {title, link}
      }
      const vue = 'https://v3.vuejs.org/guide/introduction.html'
      const vuex = 'https://vuex.vuejs.org/fr/api/'
      const web3 = 'https://web3js.readthedocs.io/en/v1.2.11/index.html'
      const solidity = 'https://docs.soliditylang.org/en/v0.8.9/'
      const metamask = 'https://docs.metamask.io/guide/'
      const gridGarden = 'https://cssgridgarden.com/'
      const flexboxFroggy = 'https://flexboxfroggy.com/'
      const mdn = 'https://developer.mozilla.org/fr/'
      return [
        link('Vue.js', vue),
        link('Vuex', vuex),
        link('Web3', web3),
        link('Solidity', solidity),
        link('MetaMask', metamask),
        {title: 'MDN', link: mdn},
        {title: 'Flexbox Froggy', link: flexboxFroggy},
        {title: 'Grid Garden', link: gridGarden},
      ]
    },
  },
  methods: {
    async goToAccount() {
      // wait to fetch the registration record,
      // after it there will be the this.registered relling if the eth address is associated with an account.
      await this.fetchRegistrationRecord();
      if (this.registered) {
        this.$router.push({name: 'AccountViewer'})
      } else {
        this.$router.push({name: 'AccountCreation'})
      }
    },
  },
})
</script>

<style lang="css" scoped>
.home-wrapper {
  margin: auto 24px auto 24px;
}

.card-body {
  padding: 12px;
  display: block;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: inherit;
  text-align: center;
  color: inherit;
  text-decoration: none;
  font-variant: small-caps;
}
</style>
