"use strict";

const mandrill = require('mandrill-api/mandrill');
const mandrill_client = new mandrill.Mandrill(__config.mandrill.apikey);
const db = require(`${__root}/common/db`);

const templates = {
    contactForm: `
        Hello!</br>
        You have received a new message from the contact form:
        <ul>
            <li>Name: *|NAME|*</li>
            <li>Email: *|EMAIL|*</li>
            <li>Phone: *|PHONE|*</li>
            <li>Message: *|MESSAGE|*</li>
        </ul>
    `,
    buyerMealMail: `
       Hello *|FIRSTNAME|*, <br/>
        <br/>
        Thanks for using ShareMy! <br/>
        <br/>
        The item <b>*|PRODUCT|*</b> is ordered for <b>*|FROMTIME|*</b> to be picked up from <b>*|ADDRESS|*</b>, 
        payment of <b>*|PRICE|* *|CURRENCY|*</b> has been accepted. <br/>
        <br/>
        Thank you, <br/>
        ShareMy Team<br/>
    `,
    buyerStuffMail: `
       Hello *|FIRSTNAME|*, <br/>
        <br/>
        Thanks for using ShareMy! <br/>
        <br/>
        The item <b>*|PRODUCT|*</b> is ordered for <b>*|FROMTIME|*</b> to be picked up from <b>*|ADDRESS|*</b>, 
        payment of <b>*|PRICE|* *|CURRENCY|*</b> has been accepted. <br/>
        Please ensure it is returned by <b>*|TOTIME|*</b>. <br/>
        <br/>
        Thank you, <br/>
        ShareMy Team<br/>
    `,
    sellerMealMail: `
       Hello *|FIRSTNAME|*, <br/>
        <br/>
        Thanks for using ShareMy! <br/>
        <br/>
        Your item <b>*|PRODUCT|*</b> has been ordered for <b>*|FROMTIME|*</b> to be picked up from <b>*|ADDRESS|*</b>, 
        payment of <b>*|PRICE|* *|CURRENCY|*</b> has been accepted. <br/>
        <br/>
        Thank you, <br/>
        ShareMy Team<br/>
    `,
    sellerStuffMail: `
       Hello *|FIRSTNAME|*, <br/>
        <br/>
        Thanks for using ShareMy! <br/>
        <br/>
        Your item <b>*|PRODUCT|*</b> has been ordered for <b>*|FROMTIME|*</b> to be picked up from <b>*|ADDRESS|*</b>, 
        payment of <b>*|PRICE|* *|CURRENCY|*</b> has been accepted. <br/>
        It will be returned by date <b>*|TOTIME|*</b>, please click here when item is returned. <br/>
        <br/>
        Thank you, <br/>
        ShareMy Team<br/>
    `,
    passwordReset: `
        Hello,<br/>
        This email was sent as a request to change the password for this email account. If you did not request this, please ignore.<br/>
        If you have requested a password reset, please click on <a href="${__config.frontendURL}#!/passwordReset/*|CODE|*">this</a> link and set your new password.
    `,
    welcomeMessage: `
    Welcome <b>*|FIRSTNAME|* *|LASTNAME|*</b>, <br/>
    Thanks for registering for ShareMy! <br/>
    <br/>
    You can now raise assets and sell or rent Skills, Stuff, Space or Meals on the ShareMy platform.
    <br />
     <br />
    Thank you,<br/>
    ShareMy Team
    `
};

const self = {
    send(messageP) {
        var message = {
            "html": templates[messageP.bodyTemplate],
            "subject": messageP.title,
            "from_email": __config.mandrill.from_email,
            "from_name": __config.mandrill.from_name,
            "to": messageP.to,
            "global_merge_vars": messageP.global_merge_vars
        };

        mandrill_client.messages.send({"message": message, "async": false}, function (result) {
            db.logs.add({msg: "mail send result", data: result, vars: message.global_merge_vars, template: messageP.bodyTemplate});
            for (let i = 0; i < result.length; i++) {
                if (result[i].reject_reason) {
                    console.log(result);
                    break;
                }
            }
        }, function (e) {
            db.logs.add({msg: "mail send error", data: e});
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    }
};

module.exports = self;