import dotenv from "dotenv"; // Import the dotenv package to load environment variables from a .env file
dotenv.config(); // Load environment variables from the .env file into process.env
import mongoose from "mongoose"; // Import the mongoose package for MongoDB object modeling
import logger from "../utils/log/logger.js";
const connectDB = async (url) => {
  // Define an asynchronous function to connect to the database
  mongoose.set("strictQuery", true); // Set mongoose to use strict query mode
    try {
      await mongoose.connect(url); // Attempt to connect to the database
      logger.info(`Database connected successfully`); // Log a success message if the connection is successful
      return; // Exit the function if the connection is successful
    } catch (error) {
      // Catch any errors that occur during the connection attempt
      console.log(`Database connection error: ${error.message}`); // Log the error message
      process.exit(1); // Exit the process with an error code
    }
  }


export default connectDB; // Export the connectDB function as the default export