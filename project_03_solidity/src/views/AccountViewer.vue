<template>
  <div class="container">
    <SingleUserAccount v-if="!isEnterprise"></SingleUserAccount>
    <EnterpriseAccount v-if="isEnterprise">Is enterprise</EnterpriseAccount>
    <Projects></Projects>
  </div>

</template>

<script lang="ts">
import {defineComponent, computed} from 'vue'
import {useStore} from "vuex";
import SingleUserAccount from '@/components/SingleUserAccount.vue'
import EnterpriseAccount from "@/components/EnterpriseAccount.vue";
import Projects from "@/components/Projects.vue";

export default defineComponent({
  components: {SingleUserAccount, EnterpriseAccount, Projects},
  setup() {
    console.log("setting up")
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    const balance = computed(() => store.state.account.balance)
    const account = computed(() => store.state.account)
    const isEnterprise = computed(() => store.state.registrationStatus.isEnterprise)
    const fetchRegistrationRecord = () => store.dispatch("fetchRegistrationRecord")
    return {address, contract, balance, account, isEnterprise, fetchRegistrationRecord}
  },
  async mounted() {
    await this.fetchRegistrationRecord();
    console.log("Account Viewer mounted, isEnterpris: ", this.isEnterprise)
    // const account = await contract.methods.user(address).call()
    // if (account.registered) this.account = account
  },
  methods: {
    async updateAccount() {
      const {address, contract} = this
      this.account = await contract.methods.user(address).call()
    },

    async payProject() {
      const {contract} = this
      await contract.methods.addBalance(200).send()
      await this.updateAccount()
    }
  },
})
</script>

<style lang="css" scoped>

.container {
  padding: 2rem;
}

</style>