var express = require('express');

var app = express();

app.use(express.logger('dev'));
app.use(express.responseTime());

app.get("*", function(req, res) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "unknown_resource" }) + "\n");
});

app.listen(8080);
