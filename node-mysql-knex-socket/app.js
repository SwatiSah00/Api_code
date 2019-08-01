//require the express module
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const ClientSocket = require("./client-socket");
// const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const todoRouter = require("./route/todo/todoRoute");
const userRouter = require("./route/todo/userRoute");
const todoAuthRouter = require("./route/todo/todoAuthRoute");
const myList = require("./route/todo/myListRoute");
const sharedToDo = require("./route/todo/shareToDoRoute");

const chatAuthRouter = require("./route/chat/chatAuthRoute");
const chatUserRouter = require("./route/chat/chatUserRoute");

//require the http module
const http = require("http").Server(app);

// require the socket.io module


const port = 5000;

//bodyparser middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
  limit: "8mb",
}));

//Todo routes
app.use("/api/todo/todo", todoRouter);
app.use("/api/todo/users", userRouter);
app.use("/api/todo/auth", todoAuthRouter);
app.use("/api/todo/shareToDo", sharedToDo);
app.use("/api/todo/myList", myList);

// // Chat routes
app.use("/api/chat/auth", chatAuthRouter);
app.use("/api/chat/users", chatUserRouter);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
// socket = io(http);
const io = require("socket.io")(http);
ClientSocket(io)
//setup event listener


http.listen(port, () => {
  console.log("Running on Port: " + port);
});

// http.listen(80, "192.168.1.1", () => {
//   console.log("Running on Port: " + port);
// });
