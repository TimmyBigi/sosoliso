import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import logger from "../utils/log/logger.js";
const connectDB = async (url) => {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(url);
    logger.info(`Database connected successfully`);
    return;
  } catch (error) {
    console.log(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
