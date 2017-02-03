<template>
  <section class="container">
    <noscript>
      Please enable your javascript
    </noscript>
    <label>Trips from {{ from }} to {{ to }}</label>

    <div>
      <ul id="example-1">
        <li v-for="trip in trips">
          {{ trip.id }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import axios from '~plugins/axios'

export default {

  //executed only on the server, must load the page data
  async data ({ req }) {
    return {
      from: req.query.from,
      to: req.query.to,
      trips: [
        {id: 1},
        {id: 2},
      ],
    }
  },

  head () {
    return {
      title: 'Trips'
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
