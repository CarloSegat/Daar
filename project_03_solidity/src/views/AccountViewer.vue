<template>
  <div class="p2">
    <SingleUserAccount v-if="!isEnterprise"></SingleUserAccount>
    <EnterpriseAccount v-if="isEnterprise">Is enterprise</EnterpriseAccount>
    <Projects></Projects>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import SingleUserAccount from '@/components/SingleUserAccount.vue'
import EnterpriseAccount from '@/components/EnterpriseAccount.vue'
import Projects from '@/components/UserProjects.vue'

export default defineComponent({
  components: { SingleUserAccount, EnterpriseAccount, Projects },
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    const balance = computed(() => store.state.account.balance)
    const account = computed(() => store.state.account)
    const isEnterprise = computed(
      () => store.state.registrationStatus.isEnterprise
    )
    const fetchRegistrationRecord = () =>
      store.dispatch('fetchRegistrationRecord')
    return {
      address,
      contract,
      balance,
      account,
      isEnterprise,
      fetchRegistrationRecord,
    }
  },
  async mounted() {
    await this.fetchRegistrationRecord()
  },
  methods: {
    async updateAccount() {
      const { address, contract } = this
      this.account = await contract.methods.user(address).call()
    },

    async payProject() {
      const { contract } = this
      await contract.methods.addBalance(200).send()
      await this.updateAccount()
    },
  },
})
</script>
