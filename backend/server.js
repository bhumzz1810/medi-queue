require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const clinicRoutes = require("./routes/clinicRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json()); // Allows Express to parse JSON request bodies
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.CLIENT_URL } });

// Security Middlewares
app.use(helmet()); // Adds security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Restrict CORS to frontend domain
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json());

// Rate Limiting (Prevent brute-force attacks)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// WebSockets for real-time updates
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/clinics", clinicRoutes);

server.listen(5000, () => console.log("Server running on port 5000"));
