<template>
  <div class="home" v-if="openCollectiveAccount">
    <div class="card-home-wrapper">
      <card
          :title="`Enterprise name: ${openCollectiveAccount.name}`"
          :subtitle="`Your eth balance is: \t\t${this.balance}`"
          :gradient="true"
          :blue="true"
      >
        <div class="explanations p1">
          Find below the members that belongs to this enterprise:
          <MemberList
              :members="this.openCollectiveAccount.members.map(eth => truncateEth(eth))"
              title="Members in this enterprise: ">
          </MemberList>
        </div>

      </card>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import Card from "@/components/Card.vue";
import MemberList from "@/components/MemberList.vue";

export default defineComponent({
  name: 'EnterpriseAccount',
  components: {Card, MemberList},
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const balance = computed(() => store.state.account.balance)
    const contract = computed(() => store.state.contract)
    const openCollectiveAccount = computed(() => store.state.openCollectiveAccount)
    const fetchEnterpriseAccount = (address: string) => store.dispatch("fetchEnterpriseAccount", {address})
    return {address, balance, contract, fetchEnterpriseAccount, openCollectiveAccount}
  },

  async mounted() {
    const {address} = this
    console.log("before calling fetch user acc")
    await this.fetchEnterpriseAccount(address)
  }

})
</script>
<style scoped>

</style>