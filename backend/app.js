const express = require("express");
const path = require("path");

const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

// Serve frontend (docs folder)
const frontendPath = path.join(__dirname, "../docs");
app.use(express.static(frontendPath));

// Default route → UI
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`NEXUS-EDU running on port ${PORT}`);
});
