import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    counter: 0,
    preferences: {}
  },
  mutations: {
    increment (state) {
      state.counter++
    },
    setPreferences (state, preferences) {
      state.preferences = preferences
    }
  },
  actions: {
	  nuxtServerInit ({ commit }, { req }) {
	    if (req.account) {
	      commit('setPreferences', req.account.preferences)
	    }
	  }
	}
})

export default store