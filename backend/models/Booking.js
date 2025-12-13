import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "checked_in", "checked_out"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
