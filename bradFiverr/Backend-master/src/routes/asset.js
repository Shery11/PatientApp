"use strict";

const db = require(`${__root}/common/db`);
const Util = require(`${__root}/common/util`);
const _ = require('lodash');

var Assets = {
    create(req, res, next) {
        let asset = req.body;
        asset.idUser = req.userSession.idUser;
        Util.queryParams2geoPoint(asset);

        asset.createdTS = new Date().getTime();

        db.user.getInfo([asset.idUser], {stripeToken: true}).then(data => {
            // console.log(data);
            if(!data || !data.length || !data[0].stripeToken) {
                res.status(400).json({status: "error", err: "stripe_not_connected"});
                next();
                return;
            }
            db.assets.create(asset).then(
                (data) => {
                    next();
                },
                (err) => {
                    res.result = err.message;
                    res.status(400);
                    next();
                }
            );
        }).catch(err => {
            res.status(500);
            next();
        });


    },

    search(req, res, next) {
        let asset = req.query;
        let query = JSON.parse(JSON.stringify(req.query));
        //
        // Parse location params
        Util.queryParams2geoPoint(asset);

        if (!asset.radius) {
            asset.radius = __config.defaultRadius;  // km
        }

        asset.location = {
            $near: {
                $geometry: asset.location,
                $maxDistance: parseFloat(asset.radius) * 1000
            }
        };

        delete asset.radius;

        //
        // parse calendar params
        let calendar = {
            startTime: null,
            endTime: null
        };
        if (req.query.startTime) {
            calendar.startTime = parseInt(req.query.startTime);
            delete req.query.startTime;
        }
        if (req.query.endTime) {
            calendar.endTime = parseInt(req.query.endTime);
            delete req.query.endTime;
        }

        if (asset.name) {
            // asset["$text"] = {
            //     $search: asset.name,
            //     $caseSensitive: false,
            //     $diacriticSensitive: false
            // };
            // delete asset.name;

            asset.name = new RegExp(asset.name, "i");
        }

        console.log(asset);
        let final = JSON.stringify(asset);
        db.searches.add({query, final});

        db.assets.find(asset).then(
            (assets) => {
                if (calendar.startTime || calendar.endTime) {
                    let uniqAssetIds = _.map(assets, "_id");

                    //
                    // filter out assets which are booked
                    db.orders.find({
                            "assetId": {
                                "$in": uniqAssetIds
                            },
                            "$or": [
                                {
                                    "calendarStartTime": {"$lte": calendar.startTime},
                                    "calendarEndTime": {"$gte": calendar.startTime}
                                },
                                {"calendarStartTime": {"$gte": calendar.startTime, "$lte": calendar.endTime}},
                                {
                                    "calendarStartTime": {"$gte": calendar.startTime},
                                    "calendarEndTime": {"$lte": calendar.endTime}
                                }
                            ]
                        },
                        {
                            _id: false,
                            assetId: true
                        }
                    ).then(function (bookedAssets) {
                        //
                        // if no entries, skip to next phase
                        if (!bookedAssets.length) {
                            updateInfo(assets);
                        }
                        let availableAssets = [];
                        let bookedAssetIds = _.map(bookedAssets, "assetId");

                        for (var i = 0; i < assets.length; i++) {
                            if (!bookedAssetIds.includes[assets[i].assetId]) {
                                availableAssets.push(assets[i]);
                            }
                        }

                        updateInfo(availableAssets)
                    });
                } else {
                    updateInfo(assets);
                }
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        );

        var updateInfo = function (availableAssets) {
            //
            // get host names
            let userIds = [];
            for (let i = 0; i < availableAssets.length; i++) {
                userIds.push(availableAssets[i].idUser);
            }
            var uniqueIds = userIds.filter(function (item, i, ar) {
                return ar.includes(item);
            });


            db.user.getInfo(uniqueIds, db.user.basicProps).then(
                function success(userData) {
                    for (var i = 0; i < availableAssets.length; i++) {
                        for (var j = 0; j < userData.length; j++) {
                            if (availableAssets[i].idUser == userData[j]._id) {
                                availableAssets[i].hostName = `${userData[j].firstName} ${userData[j].lastName}`;
                                break;
                            }
                        }
                    }

                    res.result = availableAssets;
                    next();
                },
                function error(err) {
                    res.result = err.message;
                    res.status(400);
                    next();
                }
            );
        }
    },

    get(req, res, next) {
        db.assets.findByDataId(req.params.id).then(
            (data) => {
                if (data.length) {
                    data = data[0];
                    db.user.getInfo([data.idUser]).then(
                        function success(userData) {
                            if (userData.length) {
                                data.hostName = `${userData[0].firstName} ${userData[0].lastName}`;
                            }
                            res.result = data;
                            next();
                        },
                        function error(err) {
                            res.result = err.message;
                            res.status(400);
                            next();
                        }
                    );
                } else {
                    res.result = "No object with that id";
                    res.status(400);
                    next();
                }
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        );
    },


    getAssetandcalculateInsurance(req,res,next){

        console.log(req.body);


        db.assets.findByDataId(req.body.id).then(
            (data) => {

                console.log(data);
                if (data.length) {
                    data = data[0];
                    db.user.getInfo([data.idUser]).then(
                        function success(userData) {
                            if (userData.length) {
                                data.hostName = `${userData[0].firstName} ${userData[0].lastName}`;
                            }
                            // if the profile is shared, the premium is 10% for the buyer. If not, 30% for the buyer
                            if(req.body.insurance){

                                // profile is shared
                                let price = data.price;
                                let premimum = price*10/100;
                                data.premimum = premimum;

                            }else{

                                // profile is not shared
                                let price = data.price;
                                let premimum = price*30/100;
                                data.premimum = premimum;
                             }

                            res.result = data;
                            next();
                        },
                        function error(err) {
                            res.result = err.message;
                            res.status(400);
                            next();
                        }
                    );
                } else {
                    res.result = "No object with that id";
                    res.status(400);
                    next();
                }
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        );



    },

    /**
     * https://coligo.io/building-ajax-file-uploader-with-node/
     * @param req
     * @param res
     * @param next
     */
    uploadImage(req, res, next) {
        res.result = [];
        req.files.forEach(file => res.result.push({url: file.location}));
        next();
    },

    getAssetNames(req, res, next) {
        let name = req.query.query;
        let limit = parseInt(req.query.limit);

        res.result = [];

        db.assets.getNames(name, limit).then(
            (assets) => {
                if (assets && assets.length) {
                    for (let i = 0; i < assets.length; i++) {
                        if (!res.result.includes(assets[i].name)) {
                            res.result.push(assets[i].name);
                        }
                    }
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

    remove(req, res, next) {
        var userId = req.userSession.idUser;
        // console.log("userId=" + userId);


        db.assets.findByDataId(req.params.id).then((asset)=> {

            if(asset[0].idUser != userId) {
                res.status(403).json({"reason": "You can't delete this asset, it's not yours."}).end();
                return;
            }
            db.assets.remove(req.params.id).then(
                (data) => {
                    if (data.result.n != 1) {
                        res.result = "Failed to delete asset";
                        res.status(400);
                    }
                    next();
                },
                (err) => {
                    console.log(err);
                    res.result = "Failed to delete asset";
                    res.status(400);
                    next();
                }
            );
            next();
        }).catch((asset)=>{
            res.status(404).json({"reason": "asset not found"}).end();
        });


    },

    update(req, res, next) {
        // if(req.userSession.idUser != req.body.)
        var assetId = req.params.id;
        delete req.body._id;
        db.assets.findByDataId(assetId).then(data => {
            if (!data || !data.length) {
                res.status(404);
                next();
                return;
            }
            if(data[0].idUser != req.userSession.idUser){
                res.status(400).json({"reason": "You can't update this asset"}).end();
                return;
            }
            db.assets.update(assetId, req.body).then((data) => {
                    res.result = data;
                    console.log(data);
                    next();
                })
                .catch((err) => {
                console.log(err);
                    res.json({"data": "Couldn't update"}).end();
                });

        }).catch(err => {
            res.status(404);
            next();
        });
        // console.log("iduser=" + req.userSession.idUser);
        // console.log("assetId=" + assetId);
    },

    addOrder(objectId, orderTime) {
        console.log("addOrder: ", objectId, orderTime);
        return db.assets.updatePush(objectId, { $push: { orderTimes: orderTime } });
    }
};

module.exports = Assets;