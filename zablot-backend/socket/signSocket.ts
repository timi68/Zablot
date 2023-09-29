import { STATUS } from "@lib/constants";
import HttpError from "@lib/httpError";
import { Socket } from "socket.io";
import { verify } from "@lib/token";
import { ExtendedError } from "socket.io/dist/namespace";
import { SocketSessions } from "@models/index";

export default async function signSocket(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) {
  try {
    const { token } = socket.handshake.auth;
    if (!token) throw new HttpError("Invalid request", STATUS.BAD_REQUEST);

    const { user, error } = verify(token);
    if (!user) throw new HttpError(error, STATUS.BAD_REQUEST);

    // @ts-ignore
    socket.user = {
      socket_id: socket.id,
      user_id: user._id,
    };

    const session = await SocketSessions.findOne({ user_id: user._id });

    if (session) {
      session.socket_id = socket.id;
      session.expireAt = Date.now() + 4 * 60 * 60 * 1000;
      session.save();
    } else {
      await SocketSessions.create({
        user_id: user._id,
        socket_id: socket.id,
        expireAt: Date.now() + 4 * 60 * 60 * 1000,
      });
    }

    next();
  } catch (error: any) {
    next(error);
  }
}
