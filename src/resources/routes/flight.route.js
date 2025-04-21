import express from "express";
import { createFlight,  getAllFlights, updateFlightStatus, cancelFlight, bookFlight, getAllAvailableFlights,  getBookedFlights, getcancelledFlights} from "../controllers/flight.controller.js"; 
import { isAuthenticated } from "../../middleware/isAuthenticated.js"// Import the authentication middleware
const router = express.Router();

router.post("/create-flight", createFlight); // Create a new flight
router.get("/get-all-fight",isAuthenticated, getAllFlights); // Get all flights
router.patch("/update-flight-status/:id", isAuthenticated, updateFlightStatus); // Update flight status
router.delete("/cancel-flight/:id", isAuthenticated, cancelFlight); // Cancel a flight
router.post("/book-flight", isAuthenticated, bookFlight); // Book a flight
router.get("/get-all-available-flights", isAuthenticated, getAllAvailableFlights); // Get all available flights
router.get("/get-booked-flights", isAuthenticated, getBookedFlights); // Get all booked flights
router.get("/get-cancelled-flights", isAuthenticated, getcancelledFlights); // Get all cancelled flights

export default router