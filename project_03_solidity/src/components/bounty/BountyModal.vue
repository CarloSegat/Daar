<template>
  <modal @closed="this.$emit('closed')">

    <template
        v-slot:header
        v-bind="$attrs">
      <card
          :title="`Bounty: ${bounty.title}`"
          :subtitle="`Description: ${bounty.description}`">

        <div class="p1">
          <div>
            <a :href="bounty.issueTrackerUrl">Link to issue tracker</a>
          </div>
          <div>
            Creator: {{ bounty.creator }}
          </div>
        </div>

      </card>
    </template>

    <template v-slot:subtitle
              v-bind="$attrs">
      <div
          v-bind="$attrs"
          v-if="bounty.assignee === '0x0000000000000000000000000000000000000000'"
      >
        <collective-button
            @collectiveClick="assignBounty">
          ASSIGN YOURSELF TO THIS BOUNTY & BECOME A GLORIOUS BUG-SLAYER
        </collective-button>
      </div>

      <div
          class="centerText"
          v-bind="$attrs"
          v-else>
        Bounty assigned to {{
          bounty.assignee?.toLowerCase() === address.toLowerCase()
              ? 'yourself' :
              bounty.assignee
        }}
        <collective-button
            v-if="bounty.assignee?.toLowerCase() === address.toLowerCase()"
            @collectiveClick="unassignBounty">
          Unassign yourself
        </collective-button>
      </div>

    </template>

    <template v-slot:body>

      <div
          class="centerText"
          v-bind="$attrs"
          v-if="bounty.assignee?.toLowerCase() === address.toLowerCase()">
        You are assigned to this bounty, use the buttons below to signal that you
        have completed your job.
        The project owner will have to approve it afterwards.
        <collective-button
            v-if="! bounty.markerCompleted"
            @collectiveClick="markCompletionStatus">
          MARK BOUNTY AS COMPLETED
        </collective-button>

        <collective-button
            v-if="bounty.markerCompleted"
            @collectiveClick="markCompletionStatus">
          MARK BOUNTY AS NOT COMPLETED
        </collective-button>

      </div>

      <div
          class="centerText"
          v-bind="$attrs"
          v-if="bounty.creator?.toLowerCase() === address.toLowerCase() &&
          bounty.markerCompleted">
        As the project owner confirm that the bounty has been completed
        and release the funds to pay the bounty hunter.
        <collective-button
            v-if="bounty.isOpen"
            @collectiveClick="closeBounty">
          CONFIRM BOUNTY IS COMPLETED
        </collective-button>
        <div
            class="violet"
            v-else>
          Bounty has been closed by the project owner
        </div>
      </div>

    </template>

  </modal>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import CollectiveButton from '@/components/CollectiveButton.vue'
import modal from '@/components/modal.vue'
import Card from '@/components/Card.vue'
import {useStore} from "vuex";

export default defineComponent({
  name: 'bountyModal',
  components: {modal, Card, CollectiveButton},
  props: ['bountyId', 'projectId'],
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    return {contract, address}
  },
  data() {
    const bounty: any = {};
    return {bounty}
  },
  async mounted() {
    this.bounty = await this.contract.methods.fetchBounty(this.projectId, this.bountyId).call()
  },
  updated() {
    console.log("bounty ", this.bounty);
  },
  methods: {
    async assignBounty() {
      console.log("assignBounty")
      await this.contract.methods.assignMeToBounty(this.projectId, this.bountyId).send();
      console.log("finished metamask")
      this.bounty = await this.contract.methods.fetchBounty(this.projectId, this.bountyId).call()
    },
    async unassignBounty() {
      console.log("unsassigning from: ", this.bounty)
      await this.contract.methods.unAssignMeFromBounty(this.projectId, this.bountyId).send();
      console.log("finished metamask")
      this.bounty = await this.contract.methods.fetchBounty(this.projectId, this.bountyId).call()
    },
    async markCompletionStatus(){
      await this.contract.methods.markBountyCompleted(this.projectId, this.bountyId, ! this.bounty['markerCompleted']).send();
      console.log("finished metamask")
      this.bounty = await this.contract.methods.fetchBounty(this.projectId, this.bountyId).call()
    },
    async closeBounty() {
      await this.contract.methods.closeBounty(this.projectId, this.bountyId).send();
      this.bounty = await this.contract.methods.fetchBounty(this.projectId, this.bountyId).call()

    }
  }
})
</script>

<style lang="css" scoped>

.centerText {
  text-align: center;
  margin-bottom: 0.5rem;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}


</style>
