<template>
  <form class="mb1" @submit.prevent="createProject">
    <card title="Create Project" :blue="true">
      <div class="input-members-grid">
        <input
          @keydown.enter.prevent=""
          type="text"
          class="input-full-line row1"
          v-model="projectName"
          placeholder="Type your project name"
        />
        <input
          @keydown.enter.prevent=""
          type="text"
          class="input-full-line row2"
          v-model="mission"
          placeholder="What is the project mission?"
        />
        <input
          @keydown.enter.prevent="addMember"
          type="text"
          class="input-full-line row3"
          v-model="currentMember"
          placeholder="Who are the members?"
        />
        <SubmitButton class="span2cols"></SubmitButton>

        <member-list
          class="span3rows"
          :members="this.members"
          title="Members added:"
        ></member-list>
      </div>
    </card>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import Card from '@/components/generic/Card.vue'
import SubmitButton from '@/components/generic/SubmitButton.vue'
import modal from '@/components/generic/Modal.vue'
import MemberList from '@/components/MemberList.vue'
import CollectiveButton from '@/components/generic/CollectiveButton.vue'

export default defineComponent({
  name: 'Projects',
  components: { Card, SubmitButton, MemberList },
  setup() {
    const store = useStore()
    const contract = computed(() => store.state.contract)
    const address = computed(() => store.state.account.address)
    const projects = computed(() => store.state.projects)
    const connect = () => store.dispatch('ethereumConnect')
    return { contract, address, connect, projects }
  },
  data() {
    const members: string[] = []
    const projectName = ''
    const mission = ''
    const currentMember = ''
    const showModal = false
    const selectedProject: number = null
    return { projectName, mission, currentMember, members }
  },
  methods: {
    addMember() {
      this.members.push(this.currentMember)
      this.currentMember = ''
    },
    async createProject() {
      const { projectName, mission } = this
      const members = Array.from(this.members)
      console.log('Creating project: ', projectName, mission, members)
      await this.contract.methods
        .createProject(projectName, mission, members)
        .send()
      this.$emit('projectCreated');
    },
  },
})
</script>

<style lang="css" scoped>
.input-members-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 0.24rem;
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
