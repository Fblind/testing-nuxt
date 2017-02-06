import Vue from 'vue'

function registerHandler (Vue) {

console.log("registering error handler");

// limitations: right now only "render" errors:
// see https://github.com/vuejs/vue/issues/4730
// `Vue.config.errorHandler` does not catch errors thrown in lifecycle hooks #4730


// for JS browser-level unhandled errors catching, see http://stackoverflow.com/a/10556743


	Vue.config.errorHandler = function VueErrorHandler(error, vm) {

		// logentries

		console.log("vue globally handled error", error);

    };

}

Vue.use(registerHandler)