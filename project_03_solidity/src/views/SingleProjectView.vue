<template>
  <div class="p05">
    <!-- PROJECT DETAILS -->
    <card
      :title="`Project: ${this.$route.params.name}`"
      :subtitle="`Mission: ${this.$route.params.mission}`"
    >
      <div class="p05">Owner: {{ this.$route.params.owner }}</div>
      <div class="p05">Balance: {{ this.$route.params.balance }}</div>

      <div class="p05">
        Contributors of the project
        <span v-if="areYouOwner()">
          , to pay them simply type the amount and press enter :)
        </span>
        <ul id="example-1">
          <li v-for="item in this.$route.params.contributors" :key="item">
            <span>{{ item }}</span>
            <input
              v-if="areYouOwner()"
              @keydown.enter.prevent="
                () => {
                  payContributor(item)
                }
              "
              type="text"
              v-model="payMemberAmount"
              class="input-not-full-line ml1 violet"
              placeholder="Pay member, type ammount"
            />
          </li>
        </ul>
      </div>
    </card>

    <!--  ADD FUNDS TO PROJECT  -->
    <div class="p1">
      Add funds to this project, type amount and press enter (you will have to
      refresh to see changes)
    </div>
    <input
      @keydown.enter.prevent="payProject"
      type="text"
      class="input-not-full-line violet center-h"
      v-model="ethAmmountToAdd"
      placeholder="Add funds to this project"
    />

    <collective-button
        @collectiveClick="()=>{this.isTimelineOpen = true}"
        class="mt1 mb1">View Timeline</collective-button>
    <project-timeline-modal
        @closed="this.isTimelineOpen = false"
        v-if="isTimelineOpen"
        :projectId="this.$route.params.id">
    </project-timeline-modal>

    <bounty-creation v-if="areYouOwner()" :projectId="this.$route.params.id">
    </bounty-creation>
    <bounty-list :projectId="this.$route.params.id"></bounty-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import modal from '@/components/generic/Modal.vue'
import BountyCreation from '@/components/bounty/BountyCreation.vue'
import BountyList from '@/components/bounty/BountyList.vue'
import Card from '@/components/generic/Card.vue'
import web3 from 'web3'
import { useStore } from 'vuex'
import CollectiveButton from "@/components/generic/CollectiveButton.vue";
import ProjectTimelineModal from "@/components/ProjectTimelineModal.vue";

export default defineComponent({
  components: { Card, BountyCreation, BountyList, CollectiveButton, ProjectTimelineModal },
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    console.log('single project view address: ', address)
    return { contract, address }
  },
  data() {
    const isTimelineOpen = false
    return { isTimelineOpen }
  },
  methods: {
    // when you put funds on a project the eth is taken from your account
    payProject() {
      const { contract } = this

      const w = web3.utils.toWei(this.ethAmmountToAdd, 'ether')

      contract.methods.payProject(this.$route.params.id).send({
        from: this.address,
        value: w,
      })
    },
    // when you pay a contributor, eth it's taken from the project balance
    payContributor(contributorAddress: string) {
      const { contract } = this
      const w = web3.utils.toWei(this.payMemberAmount, 'ether')
      contract.methods
        .payContributor(this.$route.params.id, contributorAddress, w)
        .send()
    },
    areYouOwner() {
      return (
        this.address.toLowerCase() ==
        String(this.$route.params.owner).toLowerCase()
      )
    },
  },
})
</script>