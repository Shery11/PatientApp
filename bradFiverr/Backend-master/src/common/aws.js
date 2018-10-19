"use strict";

var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: __config.aws.accessKeyID,
    secretAccessKey: __config.aws.secretAccessKey
});

AWS.config.apiVersions = {
    s3: '2006-03-01'
};

module.exports = {
    S3: new AWS.S3({region: __config.aws.s3Region})
};
