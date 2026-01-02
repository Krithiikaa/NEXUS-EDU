const express = require("express");
const fs = require("fs");
const router = express.Router();

const FILE = "./courses.json";

const readData = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
const writeData = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

router.get("/", (req, res) => {
  const data = readData();
  res.json(data.courses);
});

router.post("/", (req, res) => {
  const data = readData();
  data.courses.push(req.body);
  writeData(data);
  res.status(201).json({ message: "Course added", course: req.body });
});

router.put("/:id", (req, res) => {
  const data = readData();
  const id = Number(req.params.id);

  const index = data.courses.findIndex((c) => c && c.id === id);
  if (index === -1) return res.status(404).json({ message: "Course not found" });

  data.courses[index] = { ...data.courses[index], ...req.body, id };
  writeData(data);

  res.json({ message: "Course updated", course: data.courses[index] });
});

router.delete("/:id", (req, res) => {
  const data = readData();
  const id = Number(req.params.id);

  const before = data.courses.length;
  data.courses = data.courses.filter((c) => c && c.id !== id);

  if (data.courses.length === before) return res.status(404).json({ message: "Course not found" });

  writeData(data);
  res.json({ message: "Course deleted" });
});

module.exports = router;
