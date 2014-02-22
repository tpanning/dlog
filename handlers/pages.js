var async = require('async'),
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