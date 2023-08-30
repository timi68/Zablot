import { Schema } from "mongoose";

const friendSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    friends: [
      {
        _id: Schema.Types.ObjectId,
        id: Schema.Types.ObjectId,
        name: String,
        image: String,
        lastPersonToSendMessage: Schema.Types.ObjectId,
        unseenMessages: Number,
        lastMessage: String,
        isPrivate: Boolean,
        time: Number,
      },
    ],
  },
  {
    collection: "Friends",
  }
);

export default friendSchema;
