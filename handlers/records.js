var async = require('async'),
    db = require('../data/db.js'),
    record_data = require('../data/record.js');

exports.version = "0.0.1";

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
            saved_record = req.body;
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