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

app.listen(8080);
