import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { errorResMsg, successResMsg } from "../../utils/lib/response.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return errorResMsg(res, 400, "Please fill all required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return errorResMsg(res, 400, "Email already exists");

    const newUser = await User.create({ firstName, lastName, email, password });

    return successResMsg(res, 201, {
      message: "User created successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResMsg(res, 500, "Server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return errorResMsg(res, 400, "All fields are required");

    const user = await User.findOne({ email });
    if (!user) return errorResMsg(res, 404, "User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResMsg(res, 401, "Invalid credentials");

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return successResMsg(res, 200, {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return errorResMsg(res, 500, "Server error");
  }
};
