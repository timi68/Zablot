import { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    from: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    To: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Message: [
      {
        _id: Schema.Types.ObjectId,
        Format: String,
        message: String,
        url: String,
        going: String,
        coming: String,
        filename: String,
        question: String,
        options: Array,
        date: Date,
        noAnswer: Boolean,
        answered: {},
        coin: Number,
        timer: Number,
      },
    ],
    VoiceCall: [],
    VideoCall: [],
  },
  {
    collection: "Rooms",
  }
);

export default roomSchema;
