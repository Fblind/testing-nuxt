<template>

	<button v-on:click="greet">Another</button>

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
      console.fluffff("GREET")
    }
  },

}
</script>