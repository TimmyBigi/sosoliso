import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import userRoute from "./src/resources/routes/user.route.js";
import flightRoute from "./src/resources/routes/flight.route.js";
import adminRoute from "./src/resources/routes/admin.route.js";
const app = express();

// Logging
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Custom sanitize implementation (safer approach)
app.use((req, res, next) => {
  if (req.query) {
    const sanitizedQuery = mongoSanitize.sanitize(req.query);
    Object.defineProperty(req, 'sanitizedQuery', {
      value: sanitizedQuery,
      writable: true
    });
  }
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  next();
});

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/v1/", limiter);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Sosoliso!");
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/flight", flightRoute);
app.use("/api/v1/admin", adminRoute);

export default app;