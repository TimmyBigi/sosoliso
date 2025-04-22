import express from "express";
import { createFlight,  getAllFlights, updateFlightStatus, cancelFlight, bookFlight, getAllAvailableFlights,  getBookedFlights, getcancelledFlights} from "../controllers/flight.controller.js"; 
import { isAuthenticated } from "../../middleware/isAuthenticated.js"
const router = express.Router();

router.post("/create-flight", createFlight);
router.get("/get-all-fight",isAuthenticated, getAllFlights); 
router.patch("/update-flight-status/:id", isAuthenticated, updateFlightStatus);
router.delete("/cancel-flight/:id", isAuthenticated, cancelFlight); 
router.post("/book-flight", isAuthenticated, bookFlight); 
router.get("/get-all-available-flights", isAuthenticated, getAllAvailableFlights); 
router.get("/get-booked-flights", isAuthenticated, getBookedFlights); 
router.get("/get-cancelled-flights", isAuthenticated, getcancelledFlights);

export default router