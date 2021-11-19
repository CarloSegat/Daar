<template>
  <div class="wrapper" :class="blue ? 'blue-gradient' : 'violet-gradient'">
    <div class="card" :class="gradient && !blue ? 'gradient' : 'opaque'">
      <div>
        <div class="card-title p1" :class="blue ? 'blue' : 'violet'" v-if="title">
          {{ title }}
        </div>
        <div
          class="card-subtitle p1"
          :class="blue ? 'blue wrap-text' : 'violet wrap-text'"
          v-if="subtitle"
        >
          {{ subtitle }}
        </div>
      </div>
      <div class="body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    subtitle: String,
    gradient: Boolean,
    blue: Boolean,
  },
}
</script>

<style lang="css" scoped>
.wrapper {
  border-radius: 22px;
  padding: 2px;
  display: flex;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
}

.wrap-text {
  white-space: normal !important;
}

.card-title {
  padding-bottom: 3px;
  font-size: 1.5rem;
  font-weight: bold;
}

.card-subtitle {
  padding-top: 0px;
  font-size: 1.2rem;
  font-weight: 500;
  color: rgb(240, 240, 240);
  white-space: pre;
}

.body {
  flex: 1;
}
</style>
