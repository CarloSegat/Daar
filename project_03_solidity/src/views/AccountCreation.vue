<template lang="html">

  <div class="home padding">

    <div>
      <form @submit.prevent="signUpSingleUser">
        <card
            title="Create you account, enter a unique username below"
            subtitle="Type directly in the input and hit enter. All spaces will be converted to _"
        >
          <input
              @keydown.enter.prevent=""
              type="text"
              class="input-full-line"
              v-model="username"
              placeholder="Type your username here"
          />
          <SubmitButton></SubmitButton>
        </card>
      </form>
    </div>

    <div>
      <form
          @submit.prevent="signUpEnterprise">
        <card
            title="Create you enterprise account, enter a unique username"
            subtitle="Type directly in the input and hit enter. All spaces will be converted to _"
        >
          <input
              @keydown.enter.prevent=""
              id="enterprise-name"
              type="text"
              class="input-full-line"
              v-model="usernameEnterprise"
              placeholder="Type enterprise account name"
          />
          <input
              @keydown.enter.prevent="addMember"
              id="member"
              type="text"
              class="input-full-line"
              v-model="currentMember"
              placeholder="Type and press enter to add member (eth address)"
          />
          <SubmitButton></SubmitButton>

        </card>
      </form>
      <MemberList
          :members="Array.from(this.members)"
          title="Members added so far:"></MemberList>

    </div>

  </div>

</template>

<script lang="ts">
import {defineComponent, computed} from 'vue'
import {useStore} from 'vuex'
import Card from '@/components/Card.vue'
import MemberList from "@/components/MemberList.vue";
import SubmitButton from "@/components/SubmitButton.vue";

export default defineComponent({
  components: {Card, MemberList, SubmitButton},
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const balance = computed(() => store.state.account.balance)
    const contract = computed(() => store.state.contract)
    return {address, contract, balance}
  },
  data() {
    const username = ''
    const initialBalancePrivate = 0
    const usernameEnterprise = ''
    const members: string[] = []
    const initialBalance = 0
    const currentMember = ''
    return {username, initialBalancePrivate, usernameEnterprise, members, initialBalance, currentMember}
  },
  methods: {
    async signUpSingleUser() {
      const {contract, username, initialBalancePrivate} = this
      const name = username.trim().replace(/ /g, '_')
      await contract.methods.signUp(name).send()
      this.$router.push({name: 'AccountViewer'})
    },

    async signUpEnterprise() {
      const {contract, usernameEnterprise, initialBalance} = this
      const name = usernameEnterprise.trim().replace(/ /g, '_')
      const members = Array.from(this.members)
      console.log("members: ", members)
      console.log("members at creation time: ", {name, members, initialBalance})
      await contract.methods.signUpEnterprise(name, members).send()
      this.$router.push({name: 'AccountViewer'})
    },

    addMember() {
      console.log("newMember ")
      this.members.push(this.currentMember)
      this.currentMember = ''
      console.log("members: ", this.members)
      console.log("members to array: ", Array.from(this.members))
    }
    // async addTokens() {
    //   const { contract } = this
    //   await contract.methods.addBalance(200).send()
    //   await this.updateAccount()
    // },
  }
})
</script>

<style lang="css" scoped>

.padding {
  padding: 1rem;
}

.input-full-line {
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
