var async = require('async'),
    db = require('../data/db.js');

exports.version = "0.0.1";


exports.get_records = function(username, project, user_cb) {
    async.waterfall([
        function(cb) {
            db.records.find({"username": username, "project" : project}).toArray(cb);
        },
        function(results, cb) {
            var objects = [];
            for (var i in results) {
                objects[i] = new Record(results[i]);
            }
            cb(null, objects);
        }
    ],
        function(err, results) {
            user_cb(err, results);
        });
}


function Record(record_data) {
    for (var key in record_data) {
        this[key] = record_data[key]
    }
}

Record.prototype.response_obj = function() {
    var obj = {};
    for (var key in this) {
        // Normally this kind of constructor would whitelist the properties that are safe to
        // give out, but since the user can put whatever they want in a record, just make sure
        // we don't give them the database id.
        if (key != "_id" && this.hasOwnProperty(key)) {
            obj[key] = this[key]
        }
    }
    return obj;
}