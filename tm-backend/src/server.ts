import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./config/prisma";

// Import route handlers.
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import activityLogRoutes from "./routes/activityLog.routes";
import userRoutes from "./routes/user.routes";

// Import MongoDB connection function.
import connectMongoDB from "./config/mongodb";

// Load environment variables from .env file.
dotenv.config();
// Create an Express application instance.
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Authentication routes (register, login) are public and do not require authentication.
app.use("/api/auth", authRoutes);

// Task routes are protected and require authentication.
app.use("/api/tasks", taskRoutes);

// Activity log routes are protected and require authentication.
app.use("/api/activity-logs", activityLogRoutes);

// User routes are protected and require authentication. Used for assignment pickers.
app.use("/api/users", userRoutes);

// Root route for testing server and database connection.
app.get("/", async (req, res) => {
  const roles = await prisma.role.findMany();

  res.json({
    message: "Task Manager API Running",
    roles,
  });
});

// Start the server on the specified port (default 5000).
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server.
connectMongoDB();

// Start the Express server and listen for incoming requests.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
