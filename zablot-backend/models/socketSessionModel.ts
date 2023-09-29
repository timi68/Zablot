import { Schema } from "mongoose";

const socketSessionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    socket_id: {
      type: String,
      required: true,
    },
    expireAt: Date,
  },
  {
    collection: "SocketSessions",
    versionKey: false,
    minimize: false,
  }
);

// delete new object at specified time in the expireAt field
socketSessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
export default socketSessionSchema;
