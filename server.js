console.log("node is running");

let express = require("express");

let socket = require("socket.io");

let app = express();

let port = process.env.PORT || 3000;

let server = app.listen(port);

app.use(express.static("public"));

let io = socket(server);

io.on("connection", newConnection);
//serve solo per il testo
function newConnection(socket) {
  console.log("new connection: " + socket.client.id);

  let clientColor = getRandomColor();

  socket.emit("color", clientColor);
  //send the color to all the oder clients
  socket.broadcast.emit("newPlayer", clientColor);

  socket.on("mouse", mouseMessage);
  // when you move the mouse, the coordinates are printed on the terminal/server
  function mouseMessage(dataReceived) {
    console.log(socket.client.id, dataReceived);
    socket.broadcast.emit("mouseBroadcast", dataReceived);
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  if (color == '#FFFFFF'){
    color = '#000000';
  }
  return color;
}
