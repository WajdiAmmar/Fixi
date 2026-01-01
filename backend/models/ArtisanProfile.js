import mongoose from "mongoose";

const ArtisanProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: true,
    },

    artisan_type: {
      type: String,
      required: true,
    },

    experience_years: {
      type: Number,
      default: 0,
    },

    profile_name: String,
    profile_banner: String,
    profile_picture: String,

    address: {
      city: String,
      postal_code: String,
      full_address: String,
    },
    professional_experiences: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        years: { type: Number, required: true, min: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["pending_approval", "approved", "rejected"],
      default: "pending_approval",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ArtisanProfile", ArtisanProfileSchema);
