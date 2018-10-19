"use strict";

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
let db = null,
    collection = null;
const mongoConfig = __config.mongo;

// Connect using MongoClient
MongoClient.connect(mongoConfig.url, function(err, dbConn) {
    if (err) {
        throw new Error("Database not connected");
    }
    db = dbConn;
    var dbauthresult = db.authenticate(mongoConfig.user, mongoConfig.password, function(err, res) {

        var smtdb = db.db("sharemytech");
        console.log("Connected to db.");
        collection = {
            users: smtdb.collection("users"),
            orders: smtdb.collection("orders"),
            assets: smtdb.collection("assets"),
            logs: smtdb.collection("logs"),
            searches: smtdb.collection("searches")
        }
    });
});


let database = {
    user: {
        create(user) {
            user.joinDate = new Date();
            return collection.users.insertOne(user);
        },
        getPassword(email) {
            return collection.users.find({ email }, {
                    password: true,
                    firstName: true,
                    lastName: true,
                    locationString: true
                })
                .limit(1)
                .toArray();
        },
        getInfo(ids, props) {
            for (var i = 0; i < ids.length; i++) {
                ids[i] = new mongo.ObjectID(ids[i]);
            }

            return collection.users.find({ _id: { $in: ids } }, props).toArray();
        },
        update(id, data) {
            let objectId = new mongo.ObjectID(id);
            return collection.users.findOneAndUpdate({ _id: objectId }, { $set: data }, { returnOriginal: false });
        },
        updateGeneric(id, data) {
            let objectId = new mongo.ObjectID(id);
            return collection.users.findOneAndUpdate({ _id: objectId }, data);
        },
        getByMail(email) {
            return collection.users.findOne({ email }, { _id: true });
        },

        defaultProps: {
            firstName: true,
            lastName: true,
            email: true,
            location: true,
            locationString: true,
            address: true,
            phone: true,
            profileImage: true,
            reviews: true,
            "stripeToken.stripe_user_id": true,
            "summary": true,
            "description": true,
            "rating": true,
            "ratingVotes": true,
            "joinDate": true
        },
        basicProps: {
            _id: true,
            firstName: true,
            lastName: true,
        }
    },
    assets: {
        create(asset) {
            return collection.assets.insertOne(asset);
        },
        find(asset) {
            return collection.assets.find(asset).toArray();
        },
        findByDataId(objectId) {
            objectId = new mongo.ObjectID(objectId);
            return collection.assets.find({ _id: objectId }).toArray();
        },
        getNames(name, limit) {
            let query = { name: new RegExp(name, "i") };
            return collection.assets.find(query, { _id: false, name: true }).limit(limit).toArray();
        },
        remove(id) {
            var objectId = new mongo.ObjectID(id);
            return collection.assets.remove({ _id: objectId });
        },
        update(id, data) {
            let objectId = new mongo.ObjectID(id);
            return collection.assets.findOneAndUpdate({ _id: objectId }, { $set: data }, { returnOriginal: false });
        },
        updatePush(id, data) {
            let objectId = new mongo.ObjectID(id);
            return collection.assets.update({ _id: objectId }, data);
        }
    },
    orders: {
        find(condition, projection) {
            return collection.orders.find(condition, projection).toArray();
        },
        add(order) {
            return collection.orders.insertOne(order);
        },
        update(id, data) {
            // console.log("Updating id:", id);
            // console.log(data);
            return collection.orders.updateOne({ _id: id }, { $set: data });
        }
    },
    logs: {
        add(log) {
            log.when = new Date();
            return collection.logs.insertOne(log);
        }
    },
    searches: {
        add(search) {
            search.when = new Date();
            return collection.searches.insertOne(search);
        }
    }
};

module.exports = database;