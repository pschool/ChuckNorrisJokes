var express = require('express');
var router = express.Router()
var jokeService = require('./jokeService')

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

router.use(jokeService)

module.exports = router