import { Schema } from "mongoose";
const settingSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    settings: {
      type: Schema.Types.Mixed,
      require: true,
    },
  },
  {
    collection: "Settings",
    versionKey: false,
    minimize: false,
  }
);

export default settingSchema;
