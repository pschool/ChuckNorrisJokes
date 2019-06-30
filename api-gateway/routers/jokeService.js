var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
var ObjectId = require('mongodb').ObjectId
var loggingService = require('../loggingService');

const BASE_URL = 'http://api.icndb.com'
const api = apiAdapter(BASE_URL)

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-p0eqk.mongodb.net/test?retryWrites=true&w=majority";
var clientOptions = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true
};

var tokenService = require('../tokenService');

/** 
 * Obtains 1 random joke from the joke service.
*/
router.get('/jokes/random', (req, res) => {
    api.get(req.path).then(resp => {
        res.send(resp.data)
    })
});

/** 
 * Obtains a set of random joke from the joke service.
*/
router.get('/jokes/random/:amount', (req, res) => {
    api.get(req.path).then(response => {
        if (response.data.type === 'success') {
            res.send(response.data.value)
        }
        else {
            loggingService.log('Could not obtain jokes from external source.', 'error');
        }
    })
});

/**
 * Obtains all favorite jokes for a user.
 */
router.get('/jokes/favorites', (req, res) => {
    const client = new MongoClient(uri, clientOptions);
    getUserID(req.headers.authorization).then(userID => {
        client.connect(() => {
            const users = client.db("chuckNorris").collection("users");
            users.findOne({ "_id": ObjectId(userID) }).then(result => {
                res.send(result.favoriteJokes);
            }).catch(err => {
                loggingService.log(`Error occurred obtaining favorite jokes for userId: '${userID}' error: '${err}'`, 'error');
                res.status(500);
                res.send('Could not obtain favorites.');
            }).finally(() => {
                client.close();
            });
        });
    });
});

/**
 * Adds a favorite joke to a user.
 */
router.post('/jokes/favorites', (req, res) => {
    const client = new MongoClient(uri, clientOptions);
    let newJoke = req.body.joke;

    getUserID(req.headers.authorization).then(userID => {
        client.connect(() => {
            const users = client.db("chuckNorris").collection("users");
            users.findOne({ "_id": ObjectId(userID) }).then(result => {
                if (result.favoriteJokes) {
                    // Prevent adding more then 10 favorite jokes.
                    if (result.favoriteJokes.length >= 10) {
                        res.status(405);
                        res.send('Limit of 10 favorite jokes reached.');
                        return;
                    }

                    // Prevent adding duplicate favorites
                    if (findJokeIndex(result.favoriteJokes, newJoke.id) >= 0) {
                        res.status(405);
                        res.send('Cannot add duplicate jokes.');
                        return;
                    }
                    result.favoriteJokes.push(newJoke);
                } else {
                    result.favoriteJokes = [newJoke];
                }
                users.updateOne(
                    { "_id": ObjectId(userID) },
                    { $set: { "favoriteJokes": result.favoriteJokes } }
                ).then(() => {
                    res.status(200);
                    res.send(result.favoriteJokes);
                }).catch(err => {
                    loggingService.log(`Failed to add new joke to favorites for userId: '${userID}' error: '${err}'`, 'error');
                    res.status(500);
                    res.send('Failed to add joke to favorites.');
                }).finally(() => {
                    client.close();
                });
            }).catch(err => {
                loggingService.log(`Failed to add new joke to favorites for userId: '${userID}', error: '${err}'`, 'error');
                res.status(500);
                res.send('Could not find user.');
            }).finally(() => {
                client.close();
            });
        });
    });
});

/**
 * Removes a favorite joke from a user.
 */
router.delete('/jokes/favorites/:id', (req, res) => {
    const client = new MongoClient(uri, clientOptions);
    getUserID(req.headers.authorization).then(userID => {
        client.connect(() => {
            const users = client.db("chuckNorris").collection("users");
            users.findOne({ "_id": ObjectId(userID) }).then(result => {
                if (result.favoriteJokes) {
                    let index = findJokeIndex(result.favoriteJokes, req.params.id);
                    if (index >= 0) {
                        result.favoriteJokes.splice(index, 1);
                    }
                }
                users.updateOne(
                    { "_id": ObjectId(userID) },
                    { $set: { "favoriteJokes": result.favoriteJokes } }
                ).then(() => {
                    res.status(200);
                    res.send(result.favoriteJokes);
                }).catch(err => {
                    loggingService.log(`failed to remove joke '${req.params.id}' from favorites. for user: '${userID}', error: ${err}`, 'error');
                    res.status(500);
                    res.send('Failed to remove joke.');
                }).finally(() => {
                    client.close();
                });
            }).catch(err => {
                loggingService.log(`Error finding user with id: '${userID}', error: '${err}'`, 'error');
                res.status(500);
                res.send('Could not find user.');
            }).finally(() => {
                client.close();
            });
        });
    });
});

function getUserID(token) {
    return new Promise(function (resolve, reject) {
        tokenService.validateToken(token).then(decodedToken => {
            resolve(decodedToken.id);
        }).catch(() => {
            return null;
        });
    });
}

/**
 * Obtains the index of a joke from an array by id.
 */
function findJokeIndex(jokes, id) {
    index = 0;
    for (let joke of jokes) {
        if (joke.id == id) {
            return index;
        }
        index++;
    }
    return -1;
}

module.exports = router