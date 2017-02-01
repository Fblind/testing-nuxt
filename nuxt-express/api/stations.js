var router = require('express').Router()
const stations = require('../services/stations')

/* GET users listing. */
router.get('/stations', function (req, res, next) {
  res.json(stations.get())
})

router.get('/stations/changed', function (req, res, next) {
  res.json([stations.get()[3]])
})

router.post('/action', function (req, res, next) {
  console.log("req.body::: ", req.body);
  return next();
})

module.exports = router
