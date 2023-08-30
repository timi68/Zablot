import { Schema } from "mongoose";

const friendRequestsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    requests: [],
  },
  {
    collection: "FriendRequests",
  }
);

export default friendRequestsSchema;
