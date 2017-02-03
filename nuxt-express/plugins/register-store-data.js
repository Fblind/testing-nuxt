import Vue from 'vue'

function registerData (Vue) {
	Vue.mixin({
	  beforeCreate: function () {

		let data = {
			user: {
				name: "ANDA"
			}
		}

	    this.$options.store = data
	    this.$root.store = data
	  }
	})
}

Vue.use(registerData)