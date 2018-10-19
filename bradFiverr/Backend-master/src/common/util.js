"use strict";

const crypto = require('crypto');

const Util = {
    queryParams2geoPoint(asset) {
        asset.location = {
            type: "Point",
            coordinates: [
                parseFloat(asset.locationLng),
                parseFloat(asset.locationLat)
            ]
        };
        delete asset.locationLng;
        delete asset.locationLat;
    },

    bookingsOverlap(booking, calendar) {
        return (booking.startTime <= calendar.startTime && booking.endTime >= calendar.startTime) ||
            (booking.startTime >= calendar.startTime && booking.startTime <= calendar.endTime) ||
            (booking.startTime >= calendar.startTime && booking.endTime <= calendar.endTime);
    },
    
    password2hash(pass) {
        return crypto.createHash('sha1').update( pass ).digest('hex');
    },

    mail2resetCode(mail) {
        return crypto.createHash('sha256').update( mail + __config.salt1 ).digest('hex');
    }
};

module.exports = Util;