const express = require("express");
const fs = require("fs");
const router = express.Router();

const FILE = "./students.json";

const readData = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
const writeData = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

router.get("/", (req, res) => {
  const data = readData();
  res.json(data.students);
});

router.post("/", (req, res) => {
  const data = readData();
  data.students.push(req.body);
  writeData(data);
  res.status(201).json({ message: "Student added", student: req.body });
});

router.put("/:id", (req, res) => {
  const data = readData();
  const id = Number(req.params.id);

  const index = data.students.findIndex((s) => s && s.id === id);
  if (index === -1) return res.status(404).json({ message: "Student not found" });

  data.students[index] = { ...data.students[index], ...req.body, id };
  writeData(data);

  res.json({ message: "Student updated", student: data.students[index] });
});

router.delete("/:id", (req, res) => {
  const data = readData();
  const id = Number(req.params.id);

  const before = data.students.length;
  data.students = data.students.filter((s) => s && s.id !== id);

  if (data.students.length === before) return res.status(404).json({ message: "Student not found" });

  writeData(data);
  res.json({ message: "Student deleted" });
});

module.exports = router;
