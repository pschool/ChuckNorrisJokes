var express = require('express');
var router = express.Router()
var jokeService = require('./jokeService')

router.use((req, res, next) => {
    res = addHeaders(res);
    console.log("Called: ", req.path)
    next()
})

/**
 * Add cross origin headers to the response object.
 * @param res - The response object. 
 */
function addHeaders(res) {
    let allowHeaders = ["Accept", "Accept-Version", "Content-Type", "Api-Version", "Origin", "X-Requested-With"];
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", allowHeaders.join(", "));
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");

    return res;
}

router.use(jokeService)

module.exports = router