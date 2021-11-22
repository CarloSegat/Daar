<template>
  <h3>Projects List</h3>

  <project-creation></project-creation>

  <div class="home">

    <card
        v-for="(obj, index) in projects"
        :key="index"
        :title="`Project: ${obj.name}`"
        :subtitle="`Owner: ${truncateEth(obj.owner)} - Balance: ${obj.balance}`"
        @click="showModalSelectedProject(obj.id)"
    >
      <div class="p05"
      >Project mission: {{ obj.mission }}
      </div>

    </card>

    <div v-if="showModal">
      <open-project-modal
          @closed="this.showModal = false"
          :project="this.projects.filter(p => p.id === this.selectedProject)[0]"
      ></open-project-modal>
    </div>

  </div>
</template>

<script lang="ts">

import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import Card from "@/components/Card.vue";
import modal from "@/components/modal.vue";
import MemberList from "@/components/MemberList.vue";
import CollectiveButton from "@/components/CollectiveButton.vue";
import ProjectCreation from "@/components/projectCreation.vue";
import OpenProjectModal from "@/components/OpenProjectModal.vue";

export default defineComponent({
  name: 'Projects',
  components: {Card, ProjectCreation, OpenProjectModal},
  setup() {
    const store = useStore();
    const contract = computed(() => store.state.contract);
    const address = computed(() => store.state.account.address);
    const projects = computed(() => store.state.projects);
    const fetchProjects = (address: string) => store.dispatch('fetchProjects', {address})
    const connect = () => store.dispatch('ethereumConnect')
    return {contract, fetchProjects, address, connect, projects}
  },
  data() {
    const showModal = false;
    const selectedProject: number = null;
    return {showModal, selectedProject}
  },
  async mounted() {
    this.connect();
    if (this.address) {
      await this.fetchProjects(this.address);
      console.log("fetched projects: ", this.projects)
    }
  },

  methods: {
    showModalSelectedProject(id: number) {
      this.showModal = true;
      this.selectedProject = id;
    }
  }
})
</script>

<style lang="css" scoped>

.home {
  display: grid;
  align-items: center;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 24px;
}

.input-members-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 0.24rem;
}

.explanations {
  padding: 12px;
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