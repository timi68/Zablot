import { Schema } from "mongoose";

const federatedSchema = new Schema(
  {
    provider: String,
    user: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    subject: {
      required: true,
      type: String,
      unique: true,
    },
  },
  {
    collection: "FederatedCredentials",
    timestamps: true,
  }
);

export default federatedSchema;
