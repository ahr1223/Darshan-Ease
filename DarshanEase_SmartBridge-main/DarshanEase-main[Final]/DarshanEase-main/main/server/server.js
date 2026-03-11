const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/temples", require("./routes/templeRoutes"));
app.use("/api/darshans", require("./routes/darshanRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check
app.get("/", (req, res) => res.json({ message: "TempleDarshan API running ✅" }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
