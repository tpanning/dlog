var async = require('async'),
    user_data = require('../data/user.js'),
    record_data = require('../data/record.js');

exports.version = "0.0.1";

exports.getProject = function(req, res) {
    async.waterfall([
        function(cb) {
            record_data.get_records(req.params.username, req.params.project, cb);
        }
    ],
        function(err, results) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: err.message }) + "\n");
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                var html = '<html><head><title>Data : ' + req.params.username + '/' + req.params.project;
                html += '</title></head><body>';
                html += '<ul>';
                for (var i in results) {
                    var record = results[i].response_obj();
                    html += '<li>' + record.timestamp + ': ';
                    for (var key in record) {
                        if (key != 'timestamp') {
                            html += key + '=' + record[key] + ',';
                        }
                    }
                    html += '</li>';
                }
                html += '</ul>';
                html += '</body></html>';
                res.end(html);
            }
    });
}

exports.get_user = function(req, res) {
    async.waterfall([
        function(cb) {
            user_data.get_user(req.params.username, cb);
        },
        function(user, cb) {
            if (user === null) {
                // Fallback: If a user with that name doesn't exist, just create it!
                user_data.add_user(req.params.username, cb);
            } else {
                cb(null, user);
            }
        }
    ],
    function(err, user) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: err.message }) + "\n");
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            var html = '<html><head><title>' + user.username + ' Home';
            html += '</title></head><body>';
            html += '<ul>';
            for (var i in user.projects) {
                var project_name = user.projects[i].name;
                html += '<li><a href="/' + user.username + '/' + project_name + '">' + project_name + '</a></li>';
            }
            html += '</ul>';
            html += '<form method="post" action="/' + user.username + '/add_project" >';
            html += '<input type="text" name="project" placeholder="Project name"/>';
            html += '<input type="submit" title="Create project"/>';
            html += '</form>';
            html += '<ul><li><a href="/' + user.username + '/profile">Edit Profile</a></li></ul>'
            html += '</body></html>';
            res.end(html);
        }
    });
}

exports.add_project = function(req, res) {
    async.waterfall([
        function(cb) {
            user_data.add_project(req.params.username, req.body.project, cb);
        }
    ],
    function(err, results) {
        res.redirect('/' + req.params.username);
    });
}

exports.get_profile = function(req, res) {
    async.waterfall([
        function(cb) {
            user_data.get_user(req.params.username, cb);
        }
    ],
    function(err, user) {
        if (err || user == null) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<html>' +
                '<head><title>User not found</title></head>' +
                '<body>Could not find that user</body>' +
                '</html>');
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            var html = '<html><head><title>' + user.username + ' Profile';
            html += '</title></head><body>';
            html += '<form method="post" action="/' + user.username + '/profile">';
            html += '<div>Email address: <input type="text" name="email" value="' + user.email + '"/></div>';
            html += '<input type="submit" title="Update Profile"/>';
            html += '</form>';
            html += '</body></html>';
            res.end(html);
        }
    });
}

exports.update_profile = function(req, res) {
    async.waterfall([
        function(cb) {
            user_data.update_profile(req.params.username, { email: req.body.email }, cb);
        }
    ],
    function(err, user) {
        res.redirect('/' + req.params.username + '/profile');
    });
}