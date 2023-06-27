const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
  console.log("Express server started at port 3000");
});

// begin websocket server
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  //check
  let numClients = wss.clients.size;
  console.log("Clients connected: " + numClients);
  wss.broadcast("Current visitors: " + numClients);
  ws.readyState === ws.OPEN && ws.send("Welcome to my server - Ammar");
  ws.on("close", () => {
    wss.broadcast("A client has left the server");
    console.log("Client disconnected");
  });
});
wss.broadcast = function (data) {
  wss.clients.forEach(function (client) {
    client.send(data);
  });
};
