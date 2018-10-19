"use strict";

const db = require(`${__root}/common/db`);
const Util = require(`${__root}/common/util`);

const User = {
    getBasicInfo(req, res, next) {
        let idUser = req.params.id;

        db.user.getInfo([idUser], db.user.defaultProps).then(
            (data) => {
                if (data.length) {
                    res.result = data[0];
                    next();
                } else {
                    res.result = "User not found";
                    res.status(400);
                    next();
                }
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        )
    },

    getAssets(req, res, next) {
        let idUser = req.params.id;

        db.assets.find({idUser}).then(
            (data) => {
                if (data.length) {
                    res.result = data;
                } else {
                    res.result = [];
                }
                next();
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        );
    },

    update: function(req, res, next) {
        if ( req.params.id != req.userSession.idUser ) {
            res.status(400);
            res.result = "You cannot update this user profile";
            next();
        } else {
            let body = req.body;

            if (body.password) {
                body.password = Util.password2hash(body.password);
            }

            if(body.locationLat && body.locationLng) {
                Util.queryParams2geoPoint(body);
            }

            db.user.update(req.userSession.idUser, body).then(
                (data) => {

                    let props = db.user.defaultProps;
                    let result = {};
                    for(let propName in props) {
                        if(!props.hasOwnProperty(propName)) continue;
                        result[propName] = data.value[propName];
                    }
                    res.result = result;

                    next();
                },
                (err) => {
                    console.log(err);
                    res.result = "Update failed";
                    res.status(400);
                    next();
                }
            );
        }
    },

    addReview: function (req, res, next) {

        let review = req.body;
        // req.id
        db.user.updateGeneric(req.params.id, { $push: { reviews: review } }).then(function (data) {
            res.status(200).json(data).end();
        }).catch(function(err) {
            res.status(500).json({err: "Can't add review."}).end();
        });
    },

    addRating: function (req, res, next) {
        let rating = req.body;
        // req.id
        db.user.updateGeneric(req.params.id, { $push: { ratings: rating } }).then(function (data) {
            res.status(200).json(data).end();
        }).catch(function(err) {
            res.status(500).json({err: "Can't add rating."}).end();
        });
    }

};
module.exports = User;