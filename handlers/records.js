var async = require('async'),
    db = require('../data/db.js'),
    record_data = require('../data/record.js'),
    config = require('../config.js');

exports.version = "0.0.1";

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

exports.addRecord = function(req, res) {
    var saved_record = null;
    async.waterfall([
        function (cb) {
            if (!req.body) {
                cb(new Error("Can not record empty record"));
                return;
            }
            req.body.username = req.params.username;
            req.body.project = req.params.project;
            // If no timestamp is provided, this will use the server's current time.
            req.body.timestamp = new Date(req.body.timestamp);
            // If there was an error parsing the timestamp, just use the current time
            if (isNaN(req.body.timestamp.getTime())) {
                console.log("Invalid timestamp");
                req.body.timestamp = new Date();
            }
            saved_record = record_data.from_json(req.body);
            db.records.insert(saved_record.response_obj(), { safe: true }, cb);
        }, function(results, cb) {
            var warning = 0;
            var text = "There was a warning in project " + saved_record.project_name() + "\n";
            for (var key in saved_record) {
                if (saved_record.hasOwnProperty(key)) {
                    text += key + ": " + saved_record[key] + "\n";
                    if (endsWith(key, "Warning") && saved_record[key] == true) {
                        warning = 1;
                    }
                }
            }
            if (warning && config.smtpTransport !== null) {
                var mailOptions = {
                    from: config.email_from,
                    to: config.email_to,
                    subject: "Warning in " + saved_record.project_name(),
                    text: text
                };
                config.smtpTransport.sendMail(mailOptions, cb);
            } else {
                cb(null, null);
            }
        }
    ],
    function(err, results) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: err.message }) + "\n");
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(saved_record) + "\n");
        }
    });
}

exports.getProject = function(req, res) {
    async.waterfall([
        function(cb) {
            record_data.get_records(req.params.username, req.params.project, cb);
        },
    ],
    function(err, results) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: err.message }) + "\n");
        } else {
            var obj = [];
            for (var i in results) {
                obj[i] = results[i].response_obj();
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(obj) + "\n");
        }
    });
}