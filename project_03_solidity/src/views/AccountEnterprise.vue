<template lang="html">
<!-- Not logged in -->
  <div class="home" v-if="!account">
    <form
        @keypress.enter="signUp"
        @submit.prevent="signUp">
      <card
        title="Create you enterprise account, enter a unique username"
        subtitle="Type directly in the input and hit enter. All spaces will be converted to _"
      >
        <label for="enterprise-name">Name</label>
        <input
          id="enterprise-name"
          type="text"
          class="input-username"
          v-model="username"
          placeholder="Type enterprise account name"
        />
        <label for="initial-balance">Initial Balance</label>
        <input
          id="initial-balance"
          type="number"
          class="input-username"
          v-model="initialBalance"
          placeholder="Type initial balance for the enterprise account"
        />

      </card>
    </form>
  </div>

<!-- Logged in -->
  <div class="home" v-if="account">
    <div class="card-home-wrapper">
      <card
        :title="account.username"
        :subtitle="`${balance} Ξ\t\t${account.balance} Tokens`"
        :gradient="true"
      >
        <div class="explanations">
          This data has been fetched from the blockchain. You started by
          connecting MetaMask, and you fetched your data by reading the
          blockchain. Try to modify the code to see what's happening!
        </div>
        <div class="explanations">
          On your account on the contract, you have
          {{ account.balance }} tokens. If you click
          <button class="button-link" @click="addTokens">here</button>, you can
          add some token to your account. Just give it a try! And think to put
          an eye on Ganache!
        </div>
      </card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import Card from '@/components/Card.vue'

export default defineComponent({
  components: { Card },
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const balance = computed(() => store.state.account.balance)
    const contract = computed(() => store.state.contract)
    return { address, contract, balance }
  },
  data() {
    const account = null
    const username = ''
    const members: string[] = []
    const initialBalance = 0
    return { account, username, members, initialBalance }
  },
  methods: {
    async updateAccount() {
      const { address, contract } = this
      this.account = await contract.methods.enterprise(address).call()
    },
    async signUp() {
      const { contract, username, members, initialBalance } = this
      const name = username.trim().replace(/ /g, '_')
      await contract.methods.signUpEnterprise(name, members, initialBalance + 0).send()
      await this.updateAccount()
      this.username = ''
    }
  },
  async mounted() {
    const { address, contract } = this
     // this method calls the contract to see if the eth address is registered!
    const account = await contract.methods.enterprise(address).call()
    if (account.registered) {
      this.account = account
    }
  },
})
</script>

<style lang="css" scoped>
.home {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  margin: auto;
}

.explanations {
  padding: 12px;
}

.button-link {
  display: inline;
  appearance: none;
  border: none;
  background: none;
  color: inherit;
  text-decoration: underline;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.input-username {
  background: transparent;
  border: none;
  padding: 12px;
  outline: none;
  width: 100%;
  color: white;
  font-family: inherit;
  font-size: 1.3rem;
}
</style>
