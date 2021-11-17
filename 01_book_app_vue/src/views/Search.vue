<template>
  <div class='search'>
    <input v-model="message" placeholder="edit me" v-on:keyup.enter="submit"/>
    <p>Search for: {{ message }}</p>
  </div>
</template>

<script>

export default {
  methods: {
    submit: function (e){
      console.log("Input regex is: ", e.target.value);

      let serachedString = "this is an example";
      console.log("Test searched strings is: ", serachedString);

    }
  },
  data(){
    return {
      message: ''
    }
  }
}
</script>

<style lang="css" scoped>
.search {
  font-weight: 700;
  line-height: 1.3em;
  font-size: 2.3em;
  padding-bottom: 2rem;
  text-align: center;
}

</style>
