var express = require('express');
var router = express.Router();
var jokeService = require('./jokeService');
var authenticationService = require('./authenticationService');
var tokenService = require('../tokenService');
var loggingService = require('../loggingService');

router.use((req, res, next) => {
    console.log(`Request: ${req.path}, Method: ${req.method}`);
    res = addHeaders(res);
    if (req.method === "OPTIONS") {
        next();
    } else {
        const token = req.headers.authorization;

        // Block all non authentication routes.
        if (
            req.path !== '/authentication/login' &&
            req.path !== '/authentication/register'
        ) {
            tokenService.validateToken(token).then(token => {
                next();
            }).catch(() => {
                loggingService.log(`Request: ${req.path} was blocked`, 'info');
                res.status(401);
                res.send();
            });
        } else {
            next();
        }
    }
});

/**
 * Add cross origin headers to the response object.
 * @param res - The response object. 
 */
function addHeaders(res) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    return res;
}

router.use(jokeService);
router.use(authenticationService);

module.exports = router;