'use strict'
function get () {
  
  const stations = [
    { name: 'mataderos' },
    { name: 'liniers' },
    { name: 'villa luro' },
    { name: 'villa bosh' }
  ]

  return stations
}

let stations = {
  get: get
}

module.exports = stations