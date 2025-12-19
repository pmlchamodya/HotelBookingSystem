import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    capacity: { type: Number, required: true },
    image: { type: String },
    is_available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
