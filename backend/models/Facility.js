import mongoose from "mongoose";

// Define the Facility Schema
const FacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    timings: {
      type: String,
      default: "24/7",
    },
    category: {
      type: String,
      default: "Wellness",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Facility", FacilitySchema);
