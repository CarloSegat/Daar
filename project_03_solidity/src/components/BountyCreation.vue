<template>
  <form
      class="mb1"
      @submit.prevent="createBounty">
    <card title="Create Bounty"
          :blue="false"
          subtitle="Insert bounty details: wei prize is the numeric field"
    >
      <div class="bounty-input-grid">
        <input
            @keydown.enter.prevent=""
            type="number"
            class="input-username"
            v-model="weiBounty"
            placeholder="Wei Bounty"
        />
        <input
            @keydown.enter.prevent=""
            type="text"
            class="input-username"
            v-model="title"
            placeholder="Bounty's title"
        />
        <input
            @keydown.enter.prevent=""
            type="text"
            class="input-username"
            v-model="description"
            placeholder="Description"
        />
        <input
            @keydown.enter.prevent=""
            type="text"
            class="input-username"
            v-model="urlTracker"
            placeholder="URL to issue tracker (e.g. GitLab)"
        />
        <SubmitButton
        class="span2cols"></SubmitButton>

      </div>
    </card>
  </form>
</template>

<script lang="ts">

import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import Card from "@/components/Card.vue";
import SubmitButton from "@/components/SubmitButton.vue";

export default defineComponent({
  name: 'BountyCreation',
  props: ['project'],
  components: {Card, SubmitButton},
  setup() {
    const store = useStore();
    const contract = computed(() => store.state.contract);
    const fetchBounties = (projectId: number) => store.dispatch('fetchBounties', {projectId});
    return {contract, fetchBounties}
  },
  data() {
    const title = ''
    const description = ''
    const urlTracker = ''
    const weiBounty = 0;
    return {title, description, urlTracker, weiBounty }
  },
  methods: {
    async createBounty() {
      const r = await this.contract.methods.createBounty(
          this.project.id,
          this.title,
          this.description,
          this.weiBounty,
          this.urlTracker
      ).send();
      this.fetchBounties(this.project.id)
    }
  }
})
</script>

<style lang="css" scoped>

.bounty-input-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 0.24rem;
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