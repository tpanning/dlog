var async = require('async'),
    db = require('../data/db.js');

exports.version = "0.0.1";

/**
 * Calls user_cb with the user called username
 * @param username name of the user to find
 * @param user_cb callback will be called with (err, user) where the user has username
 * or null if no such user exists
 */
exports.get_user = function(username, user_cb) {
    async.waterfall([
        function(cb) {
            var cursor = db.users.find({"username": username});
            cursor.toArray(cb);
        },
        function(results, cb) {
            if (results.length < 1) {
                // If there's no matching user, just "return" a null user
                cb(null, null);
            } else {
                // Turn the database result into a proper User object
                cb(null, new User(results[0]));
            }
        }
    ],
    user_cb);
}

/**
 * Create a new user in the database that has the specified username, and call the callback
 * with the new user.
 * @param username the name of the new user
 * @param user_cb callback will be called with (err, user) where user is the newly created user
 */
exports.add_user = function(username, user_cb) {
    async.waterfall([
        function(cb) {
            db.users.insert({username: username}, { safe: true }, cb);
        },
        function(results, cb) {
            exports.get_user(username, cb);
        }
     ],
    user_cb);
}

/**
 * Add project_name to the list of projects for the specified user.
 * No error checking or duplicate checking
 * @param username
 * @param project_name
 * @param user_cb
 */
exports.add_project = function(username, project_name, user_cb) {
    db.users.update(
        {username: username},
        { $push: { projects: {name: project_name}} },
        { safe: true },
        function(err, results) {
            user_cb(err, null);
        }
    );
}

/**
 * @param user_data the data returned by the database
 * @constructor
 */
function User(user_data) {
    this.username = user_data.username;
    this.email = user_data.email;
    this.projects = [];
    for (var i in user_data.projects) {
        this.projects.push({
            name: user_data.projects[i].name
        });
    }
    this._id = user_data._id;
}

User.prototype.response_obj = function() {
    return {
        username: this.username,
        email: this.email,
        projects: this.projects
    }
}