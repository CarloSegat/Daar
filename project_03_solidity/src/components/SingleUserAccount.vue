<template>
  <div class="home" v-if="openCollectiveAccount">
    <div class="card-home-wrapper">
      <card
        :title="`${openCollectiveAccount.name}`"
          :subtitle="`Ξ\t\t${openCollectiveAccount.balance} Tokens`"
          :gradient="true"
      >
        <div class="explanations">
          This data has been fetched from the blockchain. You started by
          connecting MetaMask, and you fetched your data by reading the
          blockchain. Try to modify the code to see what's happening!
        </div>
        <div class="explanations">
          On your account on the contract, you have
          {{ openCollectiveAccount.balance }} tokens. If you click
          <button class="button-link" @click="addTokens">here</button>
          , you can
          add some token to your account. Just give it a try! And think to put
          an eye on Ganache!
        </div>
      </card>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import Card from "@/components/Card.vue";

export default defineComponent({
  name: 'SingleUserAccount',
  components: { Card },
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    const openCollectiveAccount = computed(() => store.state.openCollectiveAccount)
    const fetchSingleUserAccount = (address: string) => store.dispatch("fetchSingleUserAccount", { address })
    return { address, contract, fetchSingleUserAccount, openCollectiveAccount }
  },

  async mounted() {
    const {address} = this
    console.log("before calling fetch user acc")
    await this.fetchSingleUserAccount(address)
  }

})
</script>
<style scoped>
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

</style>