var nodemailer = require('nodemailer');

exports.email_to = "someone@example.com";
exports.email_from = "someone@example.com";

// See nodemailer documentation for how to configure this
exports.smtpTransport = nodemailer.createTransport("SMTP",{
    host: "localhost"
});

