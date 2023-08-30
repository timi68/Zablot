import { Schema } from "mongoose";

const uploadsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    uploader: {
      name: String,
      image: String,
    },
    type: String,
    url: String,
    caption: String,
    mentions_tags: Array,
    feedback: {
      Likes: Array,
      Comments: Array,
      Shares: Array,
    },
  },
  {
    collection: "Uploads",
    timestamps: true,
    versionKey: false,
  }
);

export default uploadsSchema;
