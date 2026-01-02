const express = require("express");
const path = require("path");

const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");

const app = express();
const PORT = 3000;

app.use(express.json());

// APIs
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`NEXUS-EDU running at http://localhost:${PORT}`);
});
