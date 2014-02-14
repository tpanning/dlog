var async = require('async');

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
            if (req.body.timestamp) {
                console.log("Existing timestamp " + req.body.timestamp);
                req.body.timestamp = new Date(req.body.timestamp);
            } else {
                console.log("Adding timestamp");
                req.body.timestamp = new Date();
            }
            saved_record = req.body;
            console.log("Saving record: " + JSON.stringify(saved_record));
            cb(null);
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