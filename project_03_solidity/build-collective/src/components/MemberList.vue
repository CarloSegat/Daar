<template lang="html">
  <div>
    Members added so far:
    <ul id="example-1">
      <li v-for="item in members" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'MemberList',
  props: ['members']
})
</script>

<style lang="css" scoped>
.button {
  color: rgb(89, 25, 138);
  border: none;
  appearance: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: inherit;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.button-body {
  font-variant: small-caps;
}

.transparent {
  background: transparent;
}

.visible {
  background: rgb(62, 41, 74);
}
</style>
