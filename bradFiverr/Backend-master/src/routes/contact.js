"use strict";

const Mail = require(`${__root}/common/mandrill`);

const Contact = {
    sendMessage(req, res, next) {
        let body = req.body;
        console.log(`sending contact mail from '${body.email}'`);
        
        if(body.test !== "init value") {
            res.status(400).json({err: "Is this a spam bot?"}).end();
            return;
        }
        Mail.send({
            title: "New message from the contact form",
            bodyTemplate: "contactForm",
            global_merge_vars: [
                {name: "NAME",    content: body.name},
                {name: "PHONE",    content: body.phone},
                {name: "EMAIL",   content: body.email},
                {name: "MESSAGE", content: body.message.replace(new RegExp("\n", 'g'), "<br />")}
            ],
            to: [{
                "email": __config.mandrill.contact_mail,
                "type": "to"
            }]
        });

        next();
    }
};

module.exports = Contact;