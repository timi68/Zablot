import { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    quizName: String,
    closeTime: Date,
    openTime: Date,
    Purpose: String,
    Password: String,
    Questions: Array,
  },
  {
    collection: "Quiz",
    timestamps: true,
  }
);

export default quizSchema;
