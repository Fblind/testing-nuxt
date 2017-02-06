<template>
  <section class="container">
    <noscript>
      Please enable your javascript
    </noscript>
    <label>CLient</label>

    <div>
      <ul id="example-1">
      client route!
      </ul>
    </div>
  </section>
</template>

<script>
import axios from '~plugins/axios'

export default {

  head () {
    return {
      title: 'Client route'
    }
  },

}
</script>

<style scoped>
.title
{
  margin: 30px 0;
}
.users
{
  list-style: none;
  margin: 0;
  padding: 0;
}
.user
{
  margin: 10px 0;
}
</style>
