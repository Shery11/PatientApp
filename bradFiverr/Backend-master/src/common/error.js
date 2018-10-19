"use strict";

global.CustomError = function(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
};

require('util').inherits(CustomError , Error);


module.exports.errorHandler = function errorHandler(err, req, res, next) {
    console.log(err);
    res.status(400);
    res.send({success: false, data: err.message});
};