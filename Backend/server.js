// ===== SERVER.JS =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== CONNECT TO MONGODB =====
// Replace <USERNAME>, <PASSWORD>, <DBNAME> with your MongoDB Atlas credentials
mongoose.connect(
  "mongodb+srv://Prashanthi:Prashanthi%40123@cluster0.fa39hiw.mongodb.net/tasksdb?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// ===== TASK SCHEMA =====
const taskSchema = new mongoose.Schema({
  title: String,
  priority: String,
  completed: Boolean
});

const Task = mongoose.model("Task", taskSchema);

// ===== API ROUTES =====

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Update a task (toggle completed)
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ===== START SERVER =====
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
