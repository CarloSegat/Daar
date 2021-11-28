<template>
  <h3>Projects List</h3>

  <project-creation
      @projectCreated='updateProjects'
  ></project-creation>

  <div class="home">

    <card
        v-for="(project, index) in this.projects"
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

import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import Card from "@/components/generic/Card.vue";
import ProjectCreation from "@/components/ProjectCreation.vue";

export default defineComponent({
  name: 'Projects',
  components: {Card, ProjectCreation},
  setup() {
    const store = useStore();
    const contract = computed(() => store.state.contract);
    const address = computed(() => store.state.account.address);
    const connect = () => store.dispatch('ethereumConnect')
    return {contract, address, connect}
  },
  data() {
    const selectedProject: number = null;
    const projects: any[] = [];
    return {selectedProject, projects}
  },
  async mounted() {
    this.projects = await this.contract.methods.fetchProjects(this.address).call();
  },
  methods: {
    async updateProjects() {
      this.projects = await this.contract.methods.fetchProjects(this.address).call();
    }
  }
})
</script>

<style lang="css" scoped>
</style>