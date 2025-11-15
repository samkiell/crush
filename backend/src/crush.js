const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Fake data
let todos = [
  { id: 1, text: "Learn useState", done: true },
  { id: 2, text: "Build API", done: false },
];

// Routes
app.get("/api/todos", (req, res) => res.json(todos));
app.post("/api/todos", (req, res) => {
  const newTodo = { id: Date.now(), ...req.body, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
app.patch("/api/todos/:id", (req, res) => {
  todos = todos.map((t) => (t.id == req.params.id ? { ...t, ...req.body } : t));
  res.json(todos.find((t) => t.id == req.params.id));
});
app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id != req.params.id);
  res.sendStatus(204);
});

// Start server
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
