import admin from "../models/admin.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { errorResMsg, successResMsg } from "../../utils/lib/response.js";

export const createAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return errorResMsg(res, 400, "Please fill all required fields");
    }

    const existingAdmin = await admin.findOne({ email });
    if (existingAdmin) return errorResMsg(res, 400, "Email already exists");

    const newAdmin = await admin.create({
      firstName,
      lastName,
      email,
      password,
    });

    return successResMsg(res, 201, {
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResMsg(res, 500, "Server error");
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return errorResMsg(res, 400, "All fields are required");

    const adminUser = await admin.findOne({ email });
    if (!adminUser) return errorResMsg(res, 404, "Admin not found");

    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) return errorResMsg(res, 401, "Invalid credentials");

    const token = jwt.sign(
      { _id: adminUser._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return successResMsg(res, 200, {
      message: "Login successful",
      token,
      admin: {
        id: adminUser._id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, "Server error");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
