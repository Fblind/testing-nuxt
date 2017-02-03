import injector from 'vue-inject'

class MyApi {
	get () {
		return 123;
	}
}

injector.service("api", MyApi)
