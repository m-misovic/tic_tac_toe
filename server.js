var express = require("express");
var socket = require("socket.io");

var app = express();
var server = app.listen(4000, function () {
  console.log("listening for requests on port 4000,");
});

app.use(express.static("public"));

var io = socket(server);

io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);

  socket.on("newMove", (data) => {
    io.sockets.emit("newMove", data);
  });

  socket.on("restart", (data) => {
    io.sockets.emit("restart", data);
  });
});
