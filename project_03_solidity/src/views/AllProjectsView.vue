<template>
  <div class="home p05">
    <h2>Welcome to Open Collective</h2>

    <div>
      The cumulative eth amount of all the projects currently on the platform is {{weiToEth(totalEth)}}
    </div>

    <h4>Find below all the projects currrently on the platform (including the ones you
    have created!)</h4>
    <card
        v-for="(project, index) in this.allProjects"
        :key="index"
        :title="`Project: ${project.name}`"
        :subtitle="`Owner: ${truncateEth(project.owner)} - Balance: ${weiToEth(project.balance)}`"
        @click="openSelectedProject(project, this.$router)"
    >
      <div class="p05"
      >Project mission: {{ project.mission }}
      </div>

    </card>
  </div>
</template>


<script lang="ts">
import {defineComponent, computed} from 'vue'
import modal from "@/components/generic/Modal.vue";
import BountyCreation from "@/components/bounty/BountyCreation.vue";
import BountyList from "@/components/bounty/BountyList.vue";
import Card from "@/components/generic/Card.vue";
import web3 from 'web3';
import {useStore} from "vuex";

export default defineComponent({
  components: {Card}, // BountyCreation, BountyList,
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    const allProjects = computed(() => store.state.allProjects)
    const fetchAllProjects = () => store.dispatch("fetchAllProjects");
    return {contract, address, fetchAllProjects, allProjects}
  },
  data() {
    const ethAmmountToAdd = 0;
    const payMemberAmount = 0;
    const totalEth = 0;
    return {ethAmmountToAdd, payMemberAmount, totalEth}
  },
  async mounted() {
    this.fetchAllProjects();
    this.totalEth = await this.contract.methods.getTotalBalance().call()
  }
})
</script>