import { Schema } from "mongoose";

const Notification = new Schema(
  {
    name: String,
    description: String,
    image: String,
    title: String,
    seen: Boolean,
  },
  {
    timestamps: true,
  }
);

const notificationSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    notifications: [Notification],
  },
  {
    collection: "Notifications",
  }
);

export default notificationSchema;
