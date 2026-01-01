import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subServices: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);
