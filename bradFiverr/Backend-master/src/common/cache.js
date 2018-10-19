"use strict";

const redis = require("redis"),
    client = redis.createClient({url: __config.redisUrl});

module.exports = {
    set(key, val) {
        client.set(key, val);
    },
    /**
     *
     * @param key
     * @param val
     * @param interval  - value in seconds
     */
    setExpires(key, val, interval) {
        client.set(key, val);
        client.expire(key, interval);
    },
    get(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            });
        })
    }
};