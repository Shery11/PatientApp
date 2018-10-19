"use strict";

const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const moment = require('moment');

const s3 = require(`${__root}/common/aws`).S3;
const authMiddleware = require(`${__root}/common/auth`);

const auth = require('./auth');
const geo = require('./geo');
const asset = require('./asset');
const user = require('./user');
const order = require('./order');
const contact = require('./contact');
const stripe = require(`${__root}/common/stripe`);

const v = '/v1';


const jsonParser = bodyParser.json();
const authorize = authMiddleware.authorize;

//
// file upload
const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'sharemytech',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            let filename = file.originalname.replace(/[^0-9a-zA-Z_\.]/g, '');
            let key = `uploads/${moment().format('x')}_${filename}`;
            // file.imagePublicUrl = `https://sharemytech.s3.amazonaws.com/${key}`;
            cb(null, key);
        },
        acl: 'public-read'
    })
});

//
// Alternative local upload
// var upload = multer({ dest: './' });

module.exports = function(app) {

    //
    // auth
    app.post(`${v}/auth/signup`, jsonParser, auth.signup);
    app.post(`${v}/auth/login`, jsonParser, auth.login);
    app.post(`${v}/auth/logout`, jsonParser, auth.logout);
    app.post(`${v}/auth/passwordReset`, jsonParser, auth.passwordResetRequest);
    app.put(`${v}/auth/passwordUpdate`, jsonParser, auth.passwordUpdate);

    //
    // user
    app.get( `${v}/user/:id/info`, user.getBasicInfo);
    app.get( `${v}/user/:id/assets`, user.getAssets);
    app.put( `${v}/user/:id`, authorize, jsonParser, user.update);
    app.post( `${v}/user/:id/review`, authorize, jsonParser, user.addReview);
    app.post( `${v}/user/:id/rating`, authorize, jsonParser, user.addRating);

    //
    // geo data: not used anymore
    app.get(`${v}/country`, geo.getAllCountries);
    app.get(`${v}/country/:country/city`, geo.getCity);
    
    //
    // assets
    app.get(`${v}/asset`, asset.search);
    app.post(`${v}/asset`, jsonParser, authorize, asset.create);
    app.post(`${v}/asset/file`, authorize, upload.any(), asset.uploadImage);
    app.get(`${v}/asset/:id`, asset.get);
    
    app.post(`${v}/asset/insurance`, jsonParser, asset.getAssetandcalculateInsurance);
    app.get(`${v}/assetNames`, asset.getAssetNames);
    app.delete(`${v}/asset/:id`, authorize, asset.remove);
    app.put(`${v}/asset/:id`, jsonParser, authorize, asset.update);

    //
    // orders
    app.post(`${v}/order`, authorize, jsonParser, order.add);

    //
    // contact
    app.post(`${v}/contact`, jsonParser, contact.sendMessage);

    //
    // stripe
    app.post(`${v}/stripe/registerAccessToken`, authorize, jsonParser, stripe.registerAccessToken);
    app.post(`${v}/stripe/unlinkStripe`, authorize, jsonParser, stripe.unlinkStripe);
};