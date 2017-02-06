<template>

	<button v-on:click="greet">Greet</button>

</template>


<script>

export default {

  head () {
    return {
      title: 'Test'
    }
  },

  methods: {
    greet(rowId, $event) {
      console.log("GREET")
    }
  },

}
</script>