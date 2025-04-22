import express from "express";
const router =  express.Router();
import { createAdmin, loginAdmin, getAllUsers } from "../controllers/admin.controller.js";
import {  isAuthenticated } from "../../middleware/isAuthenticated.js";

router.post("/create-admin", createAdmin); 
router.post("/login-admin", loginAdmin); 
router.get("/get-all-users", isAuthenticated,  getAllUsers); 

export default router;