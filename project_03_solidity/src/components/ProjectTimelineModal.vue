<template>
  <modal @closed="this.$emit('closed')">

    <template
        v-slot:header
        v-bind="$attrs">
      <h1>Timeline of project {{ projectId }}</h1>
    </template>

    <template v-slot:body>

      <card
          v-for="(e,index) in events"
          :key="index"
          :title="e.event"
          :subtitle="e.time">

        <div
            class="p05"
            v-for="(prop, index) in Object.keys(e.returnValues.project || e.returnValues.bounty)
            .slice(Object.keys(e.returnValues.project || e.returnValues.bounty).length / 2)"
        :key="index">
          {{prop}} : {{ (e.returnValues.project || e.returnValues.bounty)[prop]}}
        </div>

      </card>

      <collective-button
          @collectiveClick="logEvents"
      >log
      </collective-button>
    </template>

  </modal>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import CollectiveButton from '@/components/generic/CollectiveButton.vue'
import modal from '@/components/generic/Modal.vue'
import Card from '@/components/generic/Card.vue'
import {useStore} from "vuex";
import web3 from "web3";

export default defineComponent({
  name: 'ProjectTimelineModal',
  components: {modal, Card, CollectiveButton},
  props: ['projectId'],
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    const web3Instance = new web3("http://localhost:7545/");
    return {contract, address, web3Instance}
  },
  data() {
    const events: any[] = [];
    return {events}
  },
  async mounted() {
    const _events = await this.contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    })

    const eventsOfProejct = _events.filter(e => {
      console.log(e);
      return Number.parseInt(e.returnValues.bounty?.projectId) == Number.parseInt(this.projectId) ||
          Number.parseInt(e.returnValues.project?.id) == Number.parseInt(this.projectId)
    }).map(async e => {
      // let blockN = await this.web3Instance.eth.getTransaction(e['transactionHash'])
      let blockData = await this.web3Instance.eth.getBlock(e['blockNumber'])
      // console.log(blockData.timestamp)
      const date = new Date(blockData.timestamp * 1000); // create Date object
      console.log(date)
      return {...e, time: date}
    });

    this.events = await Promise.all(eventsOfProejct);
  },
  methods: {
    async logEvents() {

      this.contract.getPastEvents('allEvents',
          {
            fromBlock: 0,
            toBlock: 'latest'
          }, async function (error: any, events: any) {
            // console.log(events);
            console.log(events.filter(e => e.returnValues.projectId == 1 || e.returnValues.id == 1));
            const w = new web3("http://localhost:7545/")


            // let blockN = await w.eth.getTransaction(events[0]['transactionHash'])
            // let blockData = await w.eth.getBlock(blockN.blockNumber)
            // console.log(blockData.timestamp)

            // blockN = await w.eth.getTransaction(events[1]['transactionHash'])
            // blockData = await w.eth.getBlock(blockN.blockNumber)
            // console.log(blockData.timestamp)
          }
      )
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
