<template>
  <div class="home" v-if="openCollectiveAccount">
    <div class="card-home-wrapper">
      <card
        :title="`Personal account of: ${openCollectiveAccount.name}`"
          :subtitle="`Personal account balance: \t\t${this.balance} Tokens`"
          :gradient="true"
      >
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
    const balance = computed(() => store.state.account.balance)
    const contract = computed(() => store.state.contract)
    const openCollectiveAccount = computed(() => store.state.openCollectiveAccount)
    const fetchSingleUserAccount = (address: string) => store.dispatch("fetchSingleUserAccount", { address })
    return { address, contract, fetchSingleUserAccount, openCollectiveAccount, balance }
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