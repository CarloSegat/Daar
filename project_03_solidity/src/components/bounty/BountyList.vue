<template lang="html">
  <h3>Bounties:</h3>
  <div
      :class="`p1 bounty-grid ${this.cssClass}`">
    <bounty-viewer
        :v-if="bounties && bounties.length > 0"
        v-for="(bounty, i) in bounties"
        :key="i"
        :bounty="bounty"
        :projectId="projectId"
    >
    </bounty-viewer>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {useStore} from "vuex"
import BountyViewer from "@/components/bounty/BountyViewer.vue";

export default defineComponent({
  name: 'BountyList',
  props: ['projectId', 'cssClass'],
  components: {BountyViewer},
  setup() {
    const store = useStore();
    const bounties = computed(() => store.state.bounties);
    const fetchBounties = (projectId: number) => store.dispatch('fetchBounties', {projectId})
    return {bounties, fetchBounties};
  },
  async mounted() {
    await this.fetchBounties(this.projectId)
  }
})
</script>

<style lang="css">
</style>