<template>
  <modal @closed="this.$emit('closed')">

    <template v-slot:header>
      <card
          :title="`Project: `"
          :subtitle="`Mission: `">


      </card>
    </template>

    <template v-slot:subtitle>
      <div class="p1">
        Add funds to this project, type amount and press enter (you will have to refresh to see changes)
      </div>

    </template>


    <template v-slot:body>
      <div>ciai</div>

    </template>

  </modal>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import CollectiveButton from '@/components/CollectiveButton.vue'
import MemberList from '@/components/MemberList.vue'
import modal from '@/components/modal.vue'
import BountyCreation from '@/components/BountyCreation.vue'
import BountyList from '@/components/BountyList.vue'
import Card from '@/components/Card.vue'
import {useStore} from "vuex";
import web3 from "web3";

export default defineComponent({
  name: 'bountyModal',
  components: {modal, Card},
  props: ['isOpen', 'project'],
  setup() {
    const store = useStore()
    const address = computed(() => store.state.account.address)
    const contract = computed(() => store.state.contract)
    return {contract, address}
  },
  methods: {
  }
})
</script>

<style lang="css" scoped>

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 80%;
  margin: 0px auto;
  border-radius: 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

/*.modal-enter {*/
/*  opacity: 0;*/
/*}*/

/*.modal-leave-active {*/
/*  opacity: 0;*/
/*}*/

/*.modal-enter .modal-container,*/
/*.modal-leave-active .modal-container {*/
/*  -webkit-transform: scale(1.1);*/
/*  transform: scale(1.1);*/
/*}*/

</style>
