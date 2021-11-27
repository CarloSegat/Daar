<template>
  <div class="home p05">
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
import modal from "@/components/modal.vue";
import BountyCreation from "@/components/BountyCreation.vue";
import BountyList from "@/components/BountyList.vue";
import Card from "@/components/Card.vue";
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
    return {ethAmmountToAdd, payMemberAmount}
  },
  mounted() {
    this.fetchAllProjects();
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