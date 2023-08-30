import { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    SocketId: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Activities",
  }
);

export default activitySchema;
