<template>

    <div
    class="p05">
      <!-- PROJECT DETAILS -->
    <card
        :title="`Project: ${ this.$route.params.name }`"
        :subtitle="`Mission: ${ this.$route.params.mission }`">
      <div class="p05"> Owner: {{ this.$route.params.owner }}</div>
      <div class="p05"> Balance: {{ this.$route.params.balance }}</div>

      <div class="p05">
        Contributors of the project
        <span v-if='areYouOwner()'>
          , to pay them simply type the amount and press enter :)
        </span>
        <ul id="example-1">
          <li v-for="item in this.$route.params.contributors" :key="item">
            <span>{{ item }}</span>
            <input
                v-if="areYouOwner()"
                @keydown.enter.prevent="() => {payContributor(item)}"
                type="text"
                v-model="payMemberAmount"
                class="input-not-full-line ml1 violet"
                placeholder="Pay member, type ammount"/>
          </li>
        </ul>
      </div>

    </card>


    <!--  ADD FUNDS TO PROJECT  -->
    <div class="p1">
      Add funds to this project, type amount and press enter (you will have to refresh to see changes)
    </div>
    <input
        @keydown.enter.prevent="payProject"
        type="text"
        class="input-not-full-line violet center-h"
        v-model="ethAmmountToAdd"
        placeholder="Add funds to this project"
    />

    <bounty-creation
        v-if="areYouOwner()"
        :projectId="this.$route.params.id">
    </bounty-creation>
    <bounty-list
        :projectId="this.$route.params.id"
    ></bounty-list>
    </div>

</template>


<script lang="ts">
import {defineComponent, computed} from 'vue'
import modal from "@/components/modal.vue";
import BountyCreation from "@/components/BountyCreation.vue";
import BountyList from "@/components/BountyList.vue";
import Card from "@/components/Card.vue";
import web3 from 'web3';
import {useStore} from "vuex";

export default defineComponent({
  components: {Card, BountyCreation, BountyList},
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    console.log("single project view address: ", address)
    return {contract, address}
  },
  data() {
    const ethAmmountToAdd = '0';
    const payMemberAmount = '0';
    return {ethAmmountToAdd, payMemberAmount}
  },
  // mounted() {
  //   console.log("address == $route.params.owner ", this.address == this.$route.params.owner)
  //   console.log("address  ", this.address)
  //   console.log("this.$route.params.owner  ", this.$route.params.owner)
  // },
  methods: {
     convertEthToWei(eth: string) {
      return Number.parseFloat(eth.replace(',', '.')) * (10 ** 18)
    },
    // when you put funds on a project the eth is taken from your account
    payProject() {
      const {contract} = this;

      const w = this.convertEthToWei(this.ethAmmountToAdd)

      // web3.utils.toWei(
      //           web3.utils.toBN("" + this.ethAmmountToAdd),
      //           "ether") //web3.utils.toBN("" + this.addWeiAmount)

      contract.methods.payProject(this.$route.params.id)
          .send({
            from: this.address,
            value: w
          })
    },
    // when you pay a contributor, eth it's taken from the project balance
    payContributor(contributorAddress: string) {
      const {contract} = this;
      const w = this.convertEthToWei(this.payMemberAmount)
      contract.methods.payContributor(this.$route.params.id, contributorAddress, w)
          .send()
    },
    areYouOwner(){
      return this.address.toLowerCase() == String(this.$route.params.owner).toLowerCase();
    }
  }
})
</script>

<style lang="css" scoped>

.container {
  padding: 2rem;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 80%;
  margin: 0px auto;
  border-radius: 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}


</style>