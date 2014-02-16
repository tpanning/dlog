var async = require('async'),
    db = require('../data/db.js');

exports.version = "0.0.1";

exports.addRecord = function(req, res) {
    var saved_record = null;
    async.waterfall([
        function (cb) {
            if (!req.body) {
                cb(new Error("Can not record empty record"));
                return;
            }
            if (!req.body.username || !req.body.project) {
                cb(new Error("Records need to be identified with a username and project"));
                return;
            }
            req.body.timestamp = new Date(req.body.timestamp);
            // If there was an error parsing the timestamp, just use the current time
            if (isNaN(req.body.timestamp.getTime())) {
                console.log("Adding timestamp");
                req.body.timestamp = new Date();
            }
            saved_record = req.body;
            console.log("Saving record: " + JSON.stringify(saved_record));
            db.records.insert(saved_record, { safe: true }, cb);
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
    })
}

exports.getProject = function(req, res) {
    async.waterfall([
        function(cb) {
            db.records.find({"username": req.params.username, "project" : req.params.project}).toArray(cb);
        }
    ],
    function(err, results) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: err.message }) + "\n");
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results) + "\n");
        }
    })
}