import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    departureAirport: {
      type: String,
      required: true,
    },
    arrivalAirport: {
      type: String,
      required: true,
    },
    airlineName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    bookings: [
      {
        seatNumber: String,
        passengerDetails: {
          firstName: String,
          lastName: String,
          email: String,
          phone: String,
        },
        paymentMethod: String,
        bookingDate: Date,
      },
    ],

    status: {
      type: String,
      enum: ["available", "scheduled", "delayed", "cancelled"],
      default: "available",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Flight", flightSchema);
