#!/usr/bin/env ts-node
require("dotenv").config();

import { app, sessionMiddleWare } from "../app";
import { Socket, Server as SocketServer } from "socket.io";

import SocketController from "../socket";
import { ObjectId } from "mongodb";
import { Activities, Users } from "@models/index";
import { NextFunction } from "express";
import connectDatabase from "@helpers/connectDatabase";
import http from "node:http";

/**
 * @typedef {{request: {session: {user: string} | {passport : { user: object }}}}} Request
 * @typedef {(arg0?: Error | undefined) => void} Next
 * @typedef {socket.Socket & {request: { session: {user: string}} }} ModSocket
 */

const wrap =
  (middleware: any) => (socket: Socket & Request, next: NextFunction) =>
    middleware(socket.request, {}, next);

// const SocketSign = async (
//   socket: Socket & Request,
//    next: NextFunction
// ) => {
//   const session = socket.request.session;
//   let user = session.user ?? session.passport?.user?._id;
//   if (session && user) {
//     const new_user = new Activities({
//       UserId: new ObjectId(user),
//       SocketId: socket.id,
//     });

//     await new_user.save();
//     await Users.findByIdAndUpdate(session.user, {
//       Online: true,
//     }).exec();

//     socket.broadcast.emit("STATUS", {
//       _id: session.user,
//       online: true,
//     });
//     next();
//   } else {
//     next(new Error("unauthorized"));
//   }
// };

// it being a while o , omo. It is well

const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", async () => {
  const io = await handleServerListening();

  app.set("io", io);
  // app.set("scheduler", new scheduleController(io));

  // @ts-ignore
  io.on("connection", SocketController.bind(null));
});

server.listen(port);

// prevent running server from this file but from test file
// if (process.env.NODE_ENV !== "Testing") {

// }

export async function handleServerListening() {
  // ensure database is connected
  await connectDatabase();

  // create socket server
  const io = new SocketServer(server, {
    pingTimeout: 30000,
    pingInterval: 30000,
    // allowRequest: socketRequestHandler,
  });

  // io.use(signSocket);

  const addr = server.address();
  const bind =
    typeof addr === "string"
      ? `pipe ${addr}`
      : `http://localhost:${addr!.port}`;

  console.log(`Server listening on ${bind}`);

  return io;
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  var port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}
