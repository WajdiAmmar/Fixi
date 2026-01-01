import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true
    },
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtisanProfile",
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", ResponseSchema);

export default Response;
