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
        if (response.data.type === 'success') {
            res.send(response.data.value)
        }
        else {
            console.error('Request was not successful.')
        }
    })
})

module.exports = router