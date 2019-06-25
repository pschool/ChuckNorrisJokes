var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

const BASE_URL = 'http://api.icndb.com'
const api = apiAdapter(BASE_URL)

router.get('/jokes/random', (req, res) => {
    api.get(req.path).then(resp => {
        res.send(resp.data)
    })
})

router.get('/jokes/random/:amount', (req, res) => {
    api.get(req.path).then(response => {
        res.send(response.data)
    })
})

module.exports = router