<template lang="html">
  <div :class="`p1 ${cssClass}`">
    {{ title }}
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
  props: ['members', 'title', 'cssClass']
})
</script>

<style lang="css" scoped>

</style>
