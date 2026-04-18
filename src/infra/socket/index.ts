import passport from "passport";
import type { Request, Response } from "express";
import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { Session } from "../..";

export const io = new Server({
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const req = socket.request as Request;
  const res = {} as Response;

  Session(req, res, (sessionError) => {
    if (sessionError) {
      return next(sessionError as any);
    }

    passport.initialize()(req, res, (initError) => {
      if (initError) {
        return next(initError as any);
      }

      passport.session()(req, res, (passportError: unknown) => {
        if (passportError) {
          return next(passportError as any);
        }

        if (!req.user) {
          return next(new Error("Unauthorized"));
        }

        socket.data.user = req.user;
        return next();
      });
    });
  });
});

export const bindSocket = (httpServer: HttpServer) => {
  io.attach(httpServer);
  io.on("connection", (socket) => {
    if (socket.data.user) {
      socket.emit("ready", { ok: true });
    } else {
      socket.emit("connect_error", { ok: false });
    }

    socket.on("send_message", (data) => {
      console.log("message recived", data);
    });

    socket.on("disconnect", () => undefined);
  });
};
