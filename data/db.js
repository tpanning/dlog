var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    async = require('async');
    //local = require("../local.config.js");

var host = 'localhost';
var port = Connection.DEFAULT_PORT;
var ps = 5;

var db = new Db('dlog',
    new Server(host, port,
        { auto_reconnect: true,
            poolSize: ps}),
    { w: 1 });

/**
 * Currently for initialisation, we just want to open
 * the database.  We won't even attempt to start up
 * if this fails, as it's pretty pointless.
 */
exports.init = function (callback) {
    async.waterfall([
        // 1. open database connection
        function (cb) {
            console.log("\n** 1. open db");
            db.open(cb);
        },

        // 2. create collections for records and projects. if
        //    they already exist, then we're good.
        function (db_conn, cb) {
            console.log("\n** 2. create records and projects collections.");
            db.collection("records", cb);
        },

        function (records_coll, cb) {
            exports.records = records_coll;
            db.collection("projects", cb);
        },

        function (projects_coll, cb) {
            exports.projects = projects_coll;
            cb(null);
        }
    ], callback);
};


exports.records = null;
exports.projects = null;


