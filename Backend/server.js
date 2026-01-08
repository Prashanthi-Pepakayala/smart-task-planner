// ===== SERVER.JS =====

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== MIDDLEWARE =====
app.use(
  cors({
    origin: "*", // allow all origins (safe for demo projects)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

// ===== CONNECT TO MONGODB =====
// NOTE: In real projects, store this in environment variables
mongoose
  .connect(
    "mongodb+srv://Prashanthi:Prashanthi%40123@cluster0.fa39hiw.mongodb.net/tasksdb?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== TASK SCHEMA =====
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    priority: { type: String, required: true },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

// ===== ROUTES =====

// Health check
app.get("/", (req, res) => {
  res.send("Smart Task Planner Backend is running 🚀");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, priority, completed } = req.body;

    if (!title || !priority) {
      return res.status(400).json({ error: "Title and priority are required" });
    }

    const task = new Task({
      title,
      priority,
      completed: completed || false
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Update task (toggle completed / edit)
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
