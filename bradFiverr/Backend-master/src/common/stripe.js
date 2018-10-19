"use strict";

let http = require('http');
let request = require('request');
const db = require(`${__root}/common/db`);

//
// Set your secret key
// const stripe = require("stripe")(__config.stripe_key);
const stripe = require("stripe")(__config.stripe.client_secret);
const stripeConfig = __config.stripe;

let self = {
    charge(amount, currency, source, callback) {
        let charge = stripe.charges.create({
            amount,                     // Amount in cents
            currency,
            source,
            description: "Purchase on meals2gether"
        }, function (err, charge) {
            console.log("charge", charge);
            //
            // error charging card
            if (err) {
                console.log("err", err);
                if (err.type === 'StripeCardError') {
                    //
                    // The card has been declined
                    callback("Your card has been declined");
                } else {
                    callback("Purchase could not be completed")
                }
                console.log(err);
                return;
            }
            //
            // Charged successfully
            callback(null, charge);
        });
    },
    registerAccessToken(req, res, next) {
        let body = req.body;
        let code = body.code;

        request.post({
            url: stripeConfig.api_endpoint + "token",
            form: {
                grant_type: "authorization_code",
                client_id: stripeConfig.client_id,
                code: code,
                client_secret: stripeConfig.client_secret
            }
        }, function (err, r, body) {

            let response = JSON.parse(body);
            if (response.error) {
                response.stauts = "error";
                res.result = response;
                res.status(400);
                next();
                return;
            }
            db.user.update(req.userSession.idUser, {stripeToken: response}).then(
                (data) => {
                    res.result = {
                        status: "success",
                        data: response.stripe_user_id
                    };
                    db.logs.add({time: new Date(), msg: "stripe linked", user: req.userSession.idUser, data:{stripeToken: response}});
                    next();
                },
                (err) => {
                    res.result = {status: "error"};
                    res.status(500);
                    console.log(err);
                    next();
                }
            );


        });
    },
    unlinkStripe: function (req, res, next) {
        let idUser = req.userSession.idUser;
        // console.log("cancelAccessToken");

        db.assets.find({idUser}).then((data) => {
            // console.log(data);
            if (data.length) {

                res.result = {status: "error", message: "You have active assets.", reason: "active_assets"};
                res.status(400);
                next();
                return;
            }

            db.user.getInfo([idUser], {stripeToken: true}).then(
                (data) => {
                    if (data.length) {
                        let stripeToken = data[0].stripeToken;
                        if (!stripeToken) {
                            next();
                            return;
                        }
                        let accessToken = stripeToken.access_token;
                        // console.log(stripeToken);
                        if (accessToken) {
                            request.post({
                                url: stripeConfig.api_endpoint + "deauthorize",
                                form: {
                                    client_id: stripeConfig.client_id,
                                    stripe_user_id: stripeToken.stripe_user_id
                                },
                                headers: {
                                    Authorization: `${stripeToken.token_type} ${stripeConfig.client_secret}`
                                }
                            }, function (err, r, body) {
                                // let response = JSON.parse(body);
                                // console.log("resp:" , response);
                            });
                            db.user.update(req.userSession.idUser, {stripeToken: null}).then(
                                (data) => {
                                    res.result = {status: "success"};
                                    next();
                                },
                                (err) => {
                                    res.result = {status: "error"};
                                    res.status(500);
                                    console.log(err);
                                    next();
                                }
                            );
                        }
                        else {
                            next();
                        }
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
            );
        });
    },
    chargeToConnected: function (options, callback) {

        let stripeOptions = {
            amount: options.amount,
            currency: options.currency,
            source: options.token.id,
            destination: {
                amount: options.destinationAmount,
                account: options.stripeUserId
            }
        };
        // callback(null, stripeOptions);
        // return;
        console.log("stripe charge options:", stripeOptions);

        stripe.charges.create(stripeOptions).then((charge, err) => {
            callback(charge, err, stripeOptions);
        });
    }
};

module.exports = self;