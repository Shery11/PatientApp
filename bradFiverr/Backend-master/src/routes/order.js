"use strict";

const stripe = require(`${__root}/common/stripe`);
const db = require(`${__root}/common/db`);
const asset = require('./asset');
const Mail = require(`${__root}/common/mandrill`);


let Order = {
    addOld(req, res, next) {
        let order = req.body;
        //
        // validate order

        //
        // add to db
        order.createdTs = new Date();
        db.orders.add(order).then(
            (data) => {
                let orderId = data.insertedId;
                if(!orderId){
                    console.log("invalid order id (after insert)")
                }
                //
                // Get the credit card details submitted by the form
                let token = order.token.id;
                let orderDetails = order.product;


                stripe.charge(
                    orderDetails.totalPrice * 100, // Amount in cents
                    orderDetails.currency,
                    token,
                    function (err, charge) {
                        let transaction_success = true;

                        if (err) {
                            res.status(400);
                            transaction_success = false;
                            res.result = err;
                        }

                        //
                        // update db set payment status
                        db.orders.update(orderId, {
                            payment: {
                                err: err,
                                charge: charge
                            },
                            transaction_success
                        }).then(
                            (data) => {
                                let orderTime = {from: order.product.from, to: order.product.to};
                                asset.addOrder(order.product.id, orderTime).then(function () {
                                    res.status(200).json(data).end();
                                }).catch(function (err) {
                                    console.log(err);
                                    res.status(500).json({err: "Can't add order to asset."}).end();
                                });
                            },
                            (err) => {
                                res.status(400);
                                res.result = err.message;
                                next();
                            }
                        );

                        //
                        // send confirmation mail
                        if (transaction_success) {
                            db.assets.findByDataId(orderDetails.id).then((assets) => {
                                let asset = assets[0];
                                let mailVars = [
                                    {name: "FIRSTNAME", content: req.userSession.firstName},
                                    {name: "PRICE", content: orderDetails.totalPrice},
                                    {name: "CURRENCY", content: orderDetails.currency},
                                    {
                                        name: "PRODUCT",
                                        content: `${orderDetails.name}`
                                    },
                                    {name: "ADDRESS", content: asset.address},
                                    {name: "FROMTIME", content: formatDate(orderDetails.from)},
                                    {name: "TOTIME", content: formatDate(orderDetails.to)}
                                ];
                                var assetCategory = asset.type === "meal" ? "Meal" : "Stuff";
                                let bodyTemplate = "buyer" + assetCategory + "Mail";
                                let email = req.userSession.email;
                                Mail.send({
                                    title: "Transaction confirmation",
                                    bodyTemplate: bodyTemplate,
                                    global_merge_vars: mailVars,
                                    to: [
                                        {
                                            "email": __config.mandrill.contact_mail,
                                            "type": "to"
                                        },
                                        {
                                            "email": email,
                                            "type": "bcc"
                                        }
                                    ]
                                });

                                console.log(`sent ${bodyTemplate} to ${email}`);

                                db.user.getInfo([asset.idUser]).then(users => {
                                    if (users || users.length) {
                                        let user = users[0];
                                        let bodyTemplate = "seller" + assetCategory + "Mail";
                                        let email = user.email;
                                        Mail.send({
                                            title: "Transaction confirmation",
                                            bodyTemplate: bodyTemplate,
                                            global_merge_vars: mailVars,
                                            to: [
                                                {
                                                    "email": __config.mandrill.contact_mail,
                                                    "type": "to"
                                                },
                                                {
                                                    "email": email,
                                                    "type": "bcc"
                                                }
                                            ]
                                        });

                                        console.log(`sent ${bodyTemplate} to ${email}`);
                                    }
                                    else {
                                        console.log("couldn't find user: " + asset.idUser + ", owner of " + asset._id);
                                    }
                                }).catch(err => {
                                    console.log("couldn't find user: " + asset.idUser + ", owner of " + asset._id);
                                });
                            });

                        }
                    });
            },
            (err) => {
                res.status = 400;
                res.result = err.message;
                next();
            }
        );
    },
    add(req, res, next) {
        let order = req.body;
        let assetId = order.product.id;
        let orderDetails = order.product;
        //
        // add to db
        order.createdTs = new Date();
        // console.log(db.orders);
        // next();
        // return;
        db.orders.add(order).then((data) => {
            let orderId = data.insertedId;
            // console.log(order);
            if(!orderId){
                console.log("invalid order id (after insert)")
            }

            db.assets.findByDataId(assetId).then(data => {
                if (!data || !data.length) {
                    console.log("couldn't find asset: " + assetId);
                    res.status(404).json({err: "Can't find that asset."}).end();
                    return;
                }
                let assetObject = data[0];
                let userId = assetObject.idUser;

                if (req.userSession.idUser === userId) {
                    res.status(400).json({err: "Can't buy your own asset."}).end();
                    return;
                }

                db.user.getInfo([userId], {stripeToken: true}).then(data => {
                    let user = data[0];
                    let hasStripe = !!(user.stripeToken && user.stripeToken.stripe_user_id);
                    if (!hasStripe) {
                        res.status(400).json({status: "error", err: "Seller doesn't have stripe"}).end();
                        return;
                    }

                    let stripeUserId = user.stripeToken.stripe_user_id;
                    //charge stripe
                    stripe.chargeToConnected({
                        amount: order.product.totalPrice,
                        currency: order.product.currency,
                        token: order.token,
                        destinationAmount: order.product.totalPrice * 85 / 100,
                        stripeUserId: stripeUserId
                    }, (charge, err, stripeOptions) => {
                        let transaction_success = charge && charge.paid;
                        if (!transaction_success) {
                            res.status(400);
                            res.result = err;
                            next();
                            return;
                        }
                        //update transaction payment information
                        db.orders.update(orderId, {
                            payment: {
                                err: err,
                                charge: charge
                            },
                            transaction_success
                        }).then(data => {

                            let orderTime = {from: order.product.from, to: order.product.to};
                            asset.addOrder(order.product.id, orderTime).then(function () {
                                res.status(200).json(data).end();
                            }).catch(function (err) {
                                console.log(err);
                                res.status(500).json({err: "Couldn't add order to asset."}).end();
                            });
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({status: "error", message: err.message}).end();
                        });

                        //send mails
                        if (transaction_success) {
                            Order.sendOrderMails(req, orderDetails);
                        }

                    });

                }).catch(err => {
                    console.log("couldn't find asset seller: userId=" + userId);
                    res.status(404).json({err: "Can't find asset seller."}).end();
                });

            }).catch(err => {
                console.log("couldn't find asset: assetId=" + assetId, err);
                res.status(404).json({err: "Can't find that asset."}).end();
            });
        }).catch((err) => {
            console.log("couldn't register order: ", order);
            res.status(400).json({err: "Can't register this order."}).end();
        });
    },
    sendOrderMails(req, orderDetails) {
        db.assets.findByDataId(orderDetails.id).then((assets) => {
            let asset = assets[0];
            let mailVars = [
                {name: "FIRSTNAME", content: req.userSession.firstName},
                {name: "PRICE", content: orderDetails.totalPrice},
                {name: "CURRENCY", content: orderDetails.currency},
                {
                    name: "PRODUCT",
                    content: `${orderDetails.name}`
                },
                {name: "ADDRESS", content: asset.address},
                {name: "FROMTIME", content: formatDate(orderDetails.from)},
                {name: "TOTIME", content: formatDate(orderDetails.to)}
            ];
            let assetCategory = asset.type === "meal" ? "Meal" : "Stuff";
            let bodyTemplate = "buyer" + assetCategory + "Mail";
            let email = req.userSession.email;
            Mail.send({
                title: "Transaction confirmation",
                bodyTemplate: bodyTemplate,
                global_merge_vars: mailVars,
                to: [
                    {
                        "email": __config.mandrill.contact_mail,
                        "type": "to"
                    },
                    {
                        "email": email,
                        "type": "bcc"
                    }
                ]
            });

            console.log(`sent ${bodyTemplate} to ${email}`);

            db.user.getInfo([asset.idUser]).then(users => {
                if (users || users.length) {
                    let user = users[0];
                    let bodyTemplate = "seller" + assetCategory + "Mail";
                    let email = user.email;
                    Mail.send({
                        title: "Transaction confirmation",
                        bodyTemplate: bodyTemplate,
                        global_merge_vars: mailVars,
                        to: [
                            {
                                "email": __config.mandrill.contact_mail,
                                "type": "to"
                            },
                            {
                                "email": email,
                                "type": "bcc"
                            }
                        ]
                    });

                    console.log(`sent ${bodyTemplate} to ${email}`);
                }
                else {
                    console.log("couldn't find user: " + asset.idUser + ", owner of " + asset._id);
                }
            }).catch(err => {
                console.log("couldn't find user: " + asset.idUser + ", owner of " + asset._id);
            });
        });

    }
};

function formatDate(dateStr) {
    let dt = new Date(dateStr).toUTCString();
    dt = dt.substr(0, dt.length - 7);
    return dt;
}

module.exports = Order;
