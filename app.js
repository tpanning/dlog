var express = require('express');
var records = require('./handlers/records');
var pages = require('./handlers/pages');


var app = express();

app.use(express.logger('dev'));
app.use(express.responseTime());
app.use(express.bodyParser({ keepExtensions: true }));

app.get("/api/v1/records/:username/:project", records.getProject);
app.put("/api/v1/records/:username/:project", records.addRecord);
app.get("/:username", pages.get_user);
app.post("/:username/add_project", pages.add_project);
app.get("/:username/:project", pages.getProject);
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
