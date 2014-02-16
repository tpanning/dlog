var express = require('express');
var records = require('./handlers/records');


var app = express();

app.use(express.logger('dev'));
app.use(express.responseTime());
app.use(express.bodyParser({ keepExtensions: true }));

app.put("/api/v1/records", records.addRecord);
app.get("*", function(req, res) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "unknown_resource" }) + "\n");
});

require('./data/db.js').init(function (err, results) {
    if (err) {
        console.error("FATAL ERROR INIT:");
        console.error(err);
        process.exit(-1);
    } else {
        app.listen(8080);
    }
});
