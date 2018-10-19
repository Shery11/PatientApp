"use strict";

const db = require(`${__root}/common/db`);

var geo = {
    getAllCountries(req, res, next) {
        db.geo.getCountryCity().then(
            (data) => {
                res.result = Object.keys(data[0]).sort();
                next();
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        );
    },
    getCity(req, res, next) {
        let country = req.params.country;
        db.geo.getCities(country).then(
            (data) => {
                if (data && data[0] && data[0][country] && data[0][country].length) {
                    res.result = data[0][country].sort();
                } else {
                    res.result = "No data found";
                    res.status(400);
                }
                next();
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        );
    }
};

module.exports = geo;