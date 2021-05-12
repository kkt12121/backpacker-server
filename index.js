var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.send("<h1>hi friend!</h1>");
});

app.listen(4000, function () {
  console.log("start! express server on port 4000");
});
