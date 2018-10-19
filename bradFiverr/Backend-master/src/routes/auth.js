"use strict";

const db = require(`${__root}/common/db`);
const cache = require(`${__root}/common/cache`);
const Mail = require(`${__root}/common/mandrill`);
const authMiddleware = require(`${__root}/common/auth`);
const Util = require(`${__root}/common/util`);

const auth = {
    signup(req, res, next) {
        let user = req.body;
        var password = user.password;
        user.password = Util.password2hash(user.password);

        Util.queryParams2geoPoint(user);

        db.user.create(user).then(
            () => {

                Mail.send({
                    title: "ShareMy Registration",
                    bodyTemplate: "welcomeMessage",
                    global_merge_vars: [
                        {name: "FIRSTNAME", content: user.firstName},
                        {name: "LASTNAME", content: user.lastName},
                    ],
                    to: [{
                        "email": user.email,
                        "type": "to"
                    }]
                });

                req.body = {email: user.email, password: password};

                auth.login(req, res, next);
            },
            (err) => {
                res.result = err.message;
                res.status(400);
                next();
            }
        );
    },
    login(req, res, next) {
        let user = req.body;

        if ( user && user.password ) {
            user.password = Util.password2hash(user.password);

            db.user.getPassword(user.email).then(
                (data) => {
                    if (data.length) {
                        if (data[0].password === user.password) {
                            res.result = authMiddleware.createSession(user.email, data[0]._id, data[0].firstName, data[0].lastName, data[0].locationString);
                            next();
                        }
                    }
                    res.result = "Wrong user or password";
                    res.status(400);
                    next();
                },
                (err) => {
                    res.result = err.message;
                    res.status(400);
                    next();
                }
            );
        } else {
            res.result = "Wrong user or password";
            res.status(400);
            next();
        }
    },

    getBasicInfo(req, res) {
        res.send('Hello World!');
    },
    logout(req, res, next) {
        res.send('Hello World!');
    },
    passwordResetRequest(req, res, next) {
        let mail = req.body.email;
        
        let code = Util.mail2resetCode(mail);

        db.user.getByMail(mail).then(
            (data) => {
                if (data && data.hasOwnProperty("_id")) {
                    let _id = data._id;
                    //
                    // set the code to expire in 30 minutes
                    cache.setExpires(`resetPass:${code}`, _id, 1800);

                    Mail.send({
                        title: "Password reset",
                        bodyTemplate: "passwordReset",
                        global_merge_vars: [
                            {name: "CODE",    content: code}
                        ],
                        to: [{
                            "email": mail,
                            "type": "to"
                        }]
                    });

                    next();
                } else {
                    console.log(data);
                    res.result = "This user is not registered";
                    res.status(400);
                    next();
                }
            },
            (err) => {
                console.log(err);
                res.result = "Database error";
                res.status(400);
                next();
            }
        );
    },

    passwordUpdate(req, res, next) {
        const noLinkMessage = "The link you accessed is no longer valid. Please request a new password update and make " +
            "sure to access the link in less than 30 minutes";

        let body = req.body;
        cache.get(`resetPass:${body.code}`).then(
            (_id) => {
                if (_id) {
                    //
                    // update password
                    let password = Util.password2hash(body.password);
                    db.user.update(_id , {password}).then(
                        (data) => {
                            if (data.ok != 1) {
                                res.status(400);
                            }
                            next();
                        },
                        (err) => {
                            console.log(err);
                            res.result = "Update failed";
                            res.status(400);
                            next();
                        }
                    );
                } else {
                    res.result = noLinkMessage;
                    res.status(400);
                    next();
                }
            },
            (err) => {
                console.log(err);
                res.result = noLinkMessage;
                res.status(400);
                next();
            }
        );
    }
};

module.exports = auth;