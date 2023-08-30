import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: String,
    email: {
      type: String,

      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    sub: {
      type: String,
      default: null,
    },
    provider: String,
    gender: String,
    settings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Settings",
      },
    ],
    image: {
      profile: {
        type: String,
        default: "",
      },
      cover: {
        type: String,
        default: "",
      },
    },
    pendingRequests: {
      type: Array,
      default: [],
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastSeen: String,
    coins: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: Date,
  },
  {
    collection: "Users",
    timestamps: true,
    minimize: false,
    versionKey: false,
  }
);

export default userSchema;
