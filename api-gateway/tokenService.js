var jwt = require('jsonwebtoken');

const tokenSecret = 'verySecretToken'

exports.createToken = function (userId, email) {
    return jwt.sign({ "id": userId, "email": email, timestamp: new Date().getTime() }, tokenSecret);
}

/**
 * Checks the token validity.
 * Returns the decoded token.
 */
exports.validateToken = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, tokenSecret, function (err, decoded) {
            if (err) {
                console.error('Invalid token used.');
                reject(err);
            } else {
                const currentTimestamp = new Date().getTime();
                const timeDiff = currentTimestamp - decoded.timestamp;

                // Token is valid for 24 hours.
                if (timeDiff > 86400000) {
                    reject();
                }
                resolve(decoded);
            }
        });
    });
}