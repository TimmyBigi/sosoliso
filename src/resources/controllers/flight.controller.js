import Flight from "../models/flight.js";
import Booking from "../models/flight.js";
import { errorResMsg, successResMsg } from "../../utils/lib/response.js";


export const createFlight = async (req, res) => {
  try {
    const {
      flightNumber,
      departureTime,
      arrivalDate,
      departureAirport,
      arrivalAirport,
      airlineName,
      price,
      availableSeats,
      totalSeats,
      status
    } = req.body;

    // Validate required fields
    if (
      !flightNumber ||
      !departureTime ||
      !arrivalDate ||
      !departureAirport ||
      !arrivalAirport ||
      !airlineName ||
      !price ||
      !totalSeats
    ) {
      return errorResMsg(res, 400, "Please provide all required flight details");
    }

    // Check if flight number already exists
    const existingFlight = await Flight.findOne({ flightNumber });
    if (existingFlight) {
      return errorResMsg(res, 409, "Flight with this flight number already exists");
    }

    // Check for valid flight status
    const validStatuses = ["available", "scheduled", "cancelled", "delayed"];
    if (status && !validStatuses.includes(status)) {
      return errorResMsg(res, 400, "Invalid flight status");
    }

    // Set availableSeats to totalSeats if not provided
    const seatsAvailable = availableSeats || totalSeats;

    // Create the flight
    const newFlight = new Flight({
      flightNumber,
      departureTime,
      arrivalDate,
      departureAirport,
      arrivalAirport,
      airlineName,
      price,
      availableSeats: seatsAvailable,
      totalSeats,
      status: status || "available"
    });

    await newFlight.save();

    return res.status(201).json({
      success: true,
      message: "Flight created successfully",
      data: newFlight
    });
  } catch (error) {
    console.error("Error creating flight:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// Get all flights
export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    
    return res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error("Error fetching flights:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const getAllAvailableFlights = async (req, res) => {
  try {
    const flights = await Flight.find({ status: "available" });

    return res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error("Error fetching available flights:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getBookedFlights = async (req, res) => {
  try {
    const flights = await Flight.find({ status: "scheduled" });

    return res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error("Error fetching available flights:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const getcancelledFlights = async (req, res) => {
  try {
    const flights = await Flight.find({ status: "cancelled" });

    return res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error("Error fetching available flights:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// Update a flight
export const updateFlight = async (req, res) => {
  try {
    const {
      flightNumber,
      departureTime,
      arrivalDate,
      departureAirport,
      arrivalAirport,
      airlineName,
      price,
      availableSeats,
      totalSeats,
      status
    } = req.body;

    // Check if flight exists
    let flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found"
      });
    }

    // If flight number is being changed, check if the new one already exists
    if (flightNumber && flightNumber !== flight.flightNumber) {
      const existingFlight = await Flight.findOne({ flightNumber });
      if (existingFlight) {
        return res.status(409).json({
          success: false,
          message: "Flight with this flight number already exists"
        });
      }
    }

    // Update flight
    flight = await Flight.findByIdAndUpdate(
      req.params.id,
      {
        flightNumber,
        departureTime,
        arrivalDate,
        departureAirport,
        arrivalAirport,
        airlineName,
        price,
        availableSeats,
        totalSeats,
        status
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Flight updated successfully",
      data: flight
    });
  } catch (error) {
    console.error("Error updating flight:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const cancelFlight = async (req, res) => {
  try {
    // 1. Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: "Request body is required"
      });
    }

    // 2. Get cancellation reason or use default
    const cancellationReason = req.body.reason || 'Operational decision';

    // 3. Find the flight and ensure it exists
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found"
      });
    }

    // 4. Check if flight is already cancelled
    if (flight.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Flight is already cancelled"
      });
    }

    // 5. Update flight status to cancelled
    flight.status = 'cancelled';
    flight.cancellation = {
      cancelledAt: new Date(),
      reason: cancellationReason
    };
    await flight.save();

    // 6. Update all related bookings
    await Booking.updateMany(
      { 
        flight: flight._id,
        status: { $in: ['confirmed', 'pending'] } 
      },
      { 
        status: 'cancelled',
        cancellation: {
          initiatedBy: 'airline',
          processedAt: new Date(),
          reason: `Flight ${flight.flightNumber} cancelled: ${cancellationReason}`
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Flight cancelled successfully",
      data: {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        reason: cancellationReason,
        cancelledAt: flight.cancellation.cancelledAt
      }
    });

  } catch (error) {
    console.error("Error cancelling flight:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while cancelling flight",
      error: error.message
    });
  }
};

// Search flights by parameters

// Update flight status
export const updateFlightStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["available","scheduled", "delayed", "cancelled",].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status (available, scheduled, delayed, cancelled) is required"
      });
    }

    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Flight status updated to ${status}`,
      data: flight
    });
  } catch (error) {
    console.error("Error updating flight status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



export const bookFlight = async (req, res) => {
  try {
    const { flightId, seatNumber, passengerDetails, paymentMethod } = req.body;

    // 1. Validate required fields
    if (!flightId || !seatNumber || !passengerDetails || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          required: ["flightId", "seatNumber", "passengerDetails", "paymentMethod"]
        }
      });
    }

    // 2. Fetch flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found"
      });
    }

    // 3. Check flight status
    if (flight.status !== "available") {
      return res.status(400).json({
        success: false,
        message: `Cannot book flight already: ${flight.status}`
      });
    }

    // 4. Check seat availability
    if (flight.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "No seats available on this flight"
      });
    }

    // 5. Optional: create a bookings array if it doesn't exist
    if (!flight.bookings) {
      flight.bookings = [];
    }

    // 5.5 Check if the seatNumber is already booked
const seatAlreadyBooked = flight.bookings.some(
  (booking) => booking.seatNumber === seatNumber
);

if (seatAlreadyBooked) {
  return res.status(400).json({
    success: false,
    message: `Seat ${seatNumber} is already booked`
  });
}

    // 6. Add booking to flight
    const newBooking = {
      seatNumber,
      passengerDetails,
      paymentMethod,
      bookingDate: new Date()
    };

    flight.bookings.push(newBooking);
    flight.availableSeats -= 1;
    flight.status = "scheduled";


    await flight.save();

    const bookingRef = `SOS-${flight._id.toString().slice(-6).toUpperCase()}-${seatNumber}`;

    return res.status(201).json({
      success: true,
      message: "Flight booked successfully",
      booking: {
        reference: bookingRef,
        flight: `${flight.airlineName} ${flight.flightNumber}`,
        route: `${flight.departureAirport} → ${flight.arrivalAirport}`,
        departureTime: flight.departureTime,
        seatNumber,
        passenger: `${passengerDetails.firstName} ${passengerDetails.lastName}`,
        amount: flight.price,
        paymentMethod,
        currency: "NGN"
      }
    });

  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Booking failed",
      error: error.message
    });
  }
};


