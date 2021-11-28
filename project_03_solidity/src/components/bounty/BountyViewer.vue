<template>
  <card
      @click="showModal"
      :title="`Title: ${bounty.title}`"
      :subtitle="`Description: ${bounty.description}`">
    <div class="p05">Created by: {{ truncateEth(bounty.creator) }}
    </div>
    <div class="p05">
      Prize: {{ weiToEth(bounty.weiBounty) }} ether
    </div>
    <div
        :class="`p05 ${bounty.isOpen ? 'bg-red': 'bg-green'}`">
      Status: {{ bounty.isOpen ? "Open" : "Closed" }}
    </div>
  </card>
  <bounty-modal
      :bountyId="bounty.id"
      :projectId='projectId'
      v-if="this.isOpenModal"
      @closed="this.isOpenModal = false">
  </bounty-modal>
</template>

<script lang="ts">

import {defineComponent} from "vue";

class Bounty {
  creator = ""
  description = ""
  title = ""
  issueTrackerUrl = ""
  weiBounty = ""
  projectId = ""
  isOpen = ""
}


import Card from "@/components/generic/Card.vue";
import BountyModal from "@/components/bounty/BountyModal.vue";

export default defineComponent({
  name: 'BountyViewer',
  components: {Card, BountyModal},
  props: ['bounty', 'projectId'],
  data() {
    const isOpenModal = false;
    return {isOpenModal}
  },
  methods: {
    showModal() {
      this.isOpenModal = true;
    }
  }
})
</script>

<style lang="css" scoped>
</style>


