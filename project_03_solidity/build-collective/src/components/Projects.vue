<template>
  <h3>Projects List</h3>
  <div class="home">
    <form @submit.prevent="createProject">
      <card title="Create Project"
            subtitle="Type & hit enter"
            :blue="true"
      >
        <input
            @keydown.enter.prevent=""
            type="text"
            class="input-username"
            v-model="projectName"
            placeholder="Type your project name"
        />
        <input
            @keydown.enter.prevent=""
            type="text"
            class="input-username"
            v-model="mission"
            placeholder="What is the project mission?"
        />
        <input
            @keydown.enter.prevent="addMember"
            type="text"
            class="input-username"
            v-model="currentMember"
            placeholder="Who are the members?"
        />
        <SubmitButton></SubmitButton>
      </card>
    </form>
    <card
        v-for="(obj, index) in projects"
        :key="index"
        :title="obj.name"
        :subtitle="`Owner: ${obj.owner}`"
    >
      <div class="explanations"
      >{{ obj.mission }}
      </div>
    </card>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import Card from "@/components/Card.vue";
import SubmitButton from "@/components/SubmitButton.vue";

export default defineComponent({
  name: 'Projects',
  components: {Card, SubmitButton},
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
    const members: string[] = []
    const projectName = ''
    const mission = ''
    const currentMember = ''
    return {projectName, mission, currentMember, members}
  },
  async mounted() {
    this.connect();
    if (this.address) {
      this.fetchProjects(this.address);
    }
  },
  // updated() {
  //
  // },
  computed: {
    // projects() {
    //   const project = (owner: string, balance: number, name: string, contributors: string[], mission: string) => {
    //     return {owner, balance, name, contributors, mission}
    //   }
    //   return [
    //     project(
    //         '0xexample',
    //         10,
    //         'daar-03',
    //         [],
    //         'This is a project that aim at imporivng susti'
    //     ),
    //     project('more exexample', 0, "daar-03-final", ["0xhui"], "This is a secret project for the Italin goverment to create nuclear pizza"),
    //     project('more exexample', 0, "daar-03-final", ["0xhui"], "This is a secret project for the Italin goverment to create nuclear pizza"),
    //     project('more exexample', 0, "daar-03-final", ["0xhui"], "This is a secret project for the Italin goverment to create nuclear pizza"),
    //     project('more exexample', 0, "daar-03-final", ["0xhui"], "This is a secret project for  odlor random guii  duhfsfidu sihdfshufw the Italin goverment to create nuclear pizza"),
    //     project('more exexample', 0, "daar-03-final", ["0xhui"], "rment to create nuclear pizza")
    //   ]
    // }
  },
  methods: {
    addMember() {
      this.members.push(this.currentMember);
      this.currentMember = '';
    },
    async createProject() {
      const {projectName, mission} = this;
      const members = Array.from(this.members);
      console.log("Creating project: ", projectName, mission, members);
      await this.contract.methods.createProject(projectName, mission, members).send()
      if (this.address) {
        this.fetchProjects(this.address);
      }
    },

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