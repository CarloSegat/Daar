<template>
    <div class="modal-mask" @keydown.esc="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container blue p1">
          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="subtitle">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">

                <collective-button @click="$emit('closed')" :transparent="false">
                  CLOSE
                </collective-button>
            </slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import CollectiveButton from '@/components/CollectiveButton.vue'

export default defineComponent({
  name: 'modal',
  components: {CollectiveButton}
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
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 95%;
  margin: 0px auto;
  border-radius: 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  height: 95%;
  overflow: scroll;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

</style>
