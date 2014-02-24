// This is an example configuration file. You can copy it to config.js to use as a starting point.
var nodemailer = require('nodemailer');

exports.email_to = "someone@example.com";
exports.email_from = "someone@example.com";

// See nodemailer documentation for how to configure this
exports.smtpTransport = nodemailer.createTransport("SMTP",{
    host: "localhost"
});

