import Vue from 'vue'

function registerHandler (Vue) {

console.log("registering error handler");

// limitations: right now only "render" errors:
// see https://github.com/vuejs/vue/issues/4730
// `Vue.config.errorHandler` does not catch errors thrown in lifecycle hooks #4730

	Vue.config.errorHandler = function VueErrorHandler(error, vm) {

		// logentries

		console.log("vue globally handled error", error);

    };

}
Vue.use(registerHandler)


// for JS browser-level unhandled errors catching, see http://stackoverflow.com/a/10556743

if (process.BROWSER_BUILD) {
  
	window.onNuxtReady(function () {

		window.onerror = function(msg, url, line, col, error) {
		   // Note that col & error are new to the HTML 5 spec and may not be 
		   // supported in every browser.  It worked for me in Chrome.
		   var extra = !col ? '' : '\ncolumn: ' + col;
		   extra += !error ? '' : '\nerror: ' + error;

		   // You can view the information in an alert to see things working like this:
		   console.log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

		   // TODO: Report this error via ajax so you can keep track
		   //       of what pages have JS issues

		   var suppressErrorAlert = true;
		   // If you return true, then error alerts (like in older versions of 
		   // Internet Explorer) will be suppressed.
		   return suppressErrorAlert;
		};

	});

}


