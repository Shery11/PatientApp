"use strict";

const crypto = require('crypto');

const cache = require(`${__root}/common/cache`);

module.exports = {
    createSession(email, idUser, firstName, lastName, country) {
        let sessionKey = crypto.createHash('sha1').update( email + new Date().getTime() ).digest('hex');

        let session = {
            email,
            sessionKey,
            idUser,
            firstName,
            lastName,
            country
        };
        cache.set(`sessions:${sessionKey}`, JSON.stringify( session ));

        return session;
    },

    authorize(req, res, next) {
        let authHeader = req.headers.authorization;
        // console.log("auth: " + authHeader);
        if (authHeader) {
            let authVal = authHeader.split(" ");
            if (authVal.length === 2) {
                let type = authVal[0];
                let key = authVal[1];

                switch (type) {
                    case "sessionkey":

                        cache.get(`sessions:${ key }`).then(
                            (value) => {
                                if(!value) {
                                    res.status(400);
                                    res.json({result: "Invalid auth header value!"}).end();
                                    throw new Error("Invalid auth header value!");
                                }
                                else {
                                    req.userSession = JSON.parse(value);
                                }

                                next();
                            },
                            (err) => {
                                // console.log("err");
                                console.log(new Date());
                                throw err;
                            }
                        )
                            .catch(
                            (err) => {
                                // console.log("catch");
                            }
                        );
                        break;
                    case "apikey":
                        console.log(key);
                        next();
                        break;
                    default:
                        console.log(new Date());
                        throw new Error("Invalid Auth");
                }
            }
        }
        else {
            console.log(new Date());
            throw new Error("Invalid Auth header!");
        }
    }
};