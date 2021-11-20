<template lang="html">
  <h3>Bounties:</h3>
  <div :class="`p1 bounty-grid ${this.cssClass}`">

<!--    <bounty-viewer :v-if="bounties.length > 0"-->
<!--      :bounty="{'title': 'ifhiuiuhw', 'description': 'fwx efw ew f ex'}"></bounty-viewer>-->
    <bounty-viewer
        :v-if="bounties && bounties.length > 0"
        v-for="(bounty, i) in bounties"
        :key="i"
        :bounty="bounty"
    >
    </bounty-viewer>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {useStore} from "vuex";
import BountyViewer from '@/components/BountyViewer'

export default defineComponent({
  name: 'BountyList',
  props: ['project', 'cssClass'],
  components: { BountyViewer },
  setup() {
    const store = useStore();
    const bounties = computed(() => store.state.bounties);
    const fetchBounties = (projectId: number) => store.dispatch('fetchBounties', { projectId })
    return {bounties, fetchBounties};
  },
  async mounted() {
    console.log("fetching bounties")
    await this.fetchBounties(this.project.id)
  }
})
</script>

<style lang="css">
.bounty-grid {
   display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 0.1rem;
}
</style>