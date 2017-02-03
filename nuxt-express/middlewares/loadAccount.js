module.exports = function (req, res, next) {
	req.account = {
		preferences: {color: "#123"}
	}
	next()
}