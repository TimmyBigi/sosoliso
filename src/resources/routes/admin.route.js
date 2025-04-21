import express from "express";
const router =  express.Router();
import { createAdmin, loginAdmin, getAllUsers } from "../controllers/admin.controller.js";
import {  isAuthenticated } from "../../middleware/isAuthenticated.js"; // Import the authentication middleware

router.post("/create-admin", createAdmin); // Create a new admin
router.post("/login-admin", loginAdmin); // Admin login
router.get("/get-all-users", isAuthenticated,  getAllUsers); // Get all users

export default router;