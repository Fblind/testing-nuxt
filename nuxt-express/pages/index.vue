<template>
  <section class="container">
    <noscript>
      Please enable your javascript
    </noscript>
    <label>Where the request comes from: {{ name }}</label>
    
    <div>
      <test></test>
      <another></another>
    </div>
    
    <div>

      <!-- server side route: /page, client side: #/page -->

      <form action="/trips" method="GET">
        <label name="from">From</label>
        <select v-model="selectedFrom" @change="changeTo" name="from">
          <option v-for="from in froms" v-bind:value="from.name">
            {{ from.name }}
          </option>
        </select>
        <label name="to">To</label>
        <select v-model="selectedTo" name="to">
          <option v-for="to in tos" v-bind:value="to.name">
            {{ to.name }}
          </option>
        </select>
        <div>Selected From: {{ selectedFrom }}</div>
        <div>Selected To: {{ selectedTo }}</div>
        <input type="submit" value="Submit">
      </form>

    </div>

    <div>
      <router-link to="client">GO TO THE CLIENT WITH ROUTER LINK</router-link>
    </div>

  </section>
</template>

<script>
import axios from '~plugins/axios'

import Test from '../components/Test'
import Another from '../components/Another'

export default {

  components: {
    test: Test,
    another: Another
  },

  //executed only on the server, must load the page data
  async data ({ req }) {
    let users  = await axios.get('/api/users')
    let stations = await axios.get('/api/stations')
    return {
      users: users.data,
      name: req ? 'server' : 'client',
      selectedFrom: '',
      froms: stations.data,
      selectedTo: '',
      tos: stations.data
    }
  },

  head () {
    return {
      title: 'Users'
    }
  },

  dependencies: "api",

  //executed only on the browser, triggered by user actions
  methods: {
    async changeTo(rowId, $event) {

console.log("$store!", this.$store);
console.log("injected api", this.api)

      let newStations = await axios.get('/api/stations/changed')
      this.tos = newStations.data;
    }
  },

  //executed only on the browser, before the view is loaded
  beforeMount () {
    return;
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
