<template>
  <card :title="`Title: ${bounty.title}`" :subtitle="`Description: ${bounty.description}`">
    <div class="p05">Created by: {{truncateEth(bounty.creator)}}
    </div>
    <div class="p05">
      Prize: {{bounty.weiBounty}} wei
    </div>
    <div
    :class="`p05 ${bounty.isOpen ? 'bg-green' : 'bg-red'}`">
      Status: {{ bounty.isOpen ? "Open" : "Closed"}}
    </div>
  </card>
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
import Card from "@/components/Card.vue";

export default defineComponent({
  name: 'BountyViewer',
  components: { Card },
  props: ['bounty'],
})
</script>

<style lang="css" scoped>
</style>


