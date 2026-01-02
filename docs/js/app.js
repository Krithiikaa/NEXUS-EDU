const STUDENTS_API = "/api/students";
const COURSES_API = "/api/courses";

// Tabs
const tabStudentsBtn = document.getElementById("tabStudentsBtn");
const tabCoursesBtn = document.getElementById("tabCoursesBtn");
const studentsTab = document.getElementById("studentsTab");
const coursesTab = document.getElementById("coursesTab");

tabStudentsBtn.addEventListener("click", () => {
  tabStudentsBtn.classList.add("active");
  tabCoursesBtn.classList.remove("active");
  studentsTab.classList.remove("hidden");
  coursesTab.classList.add("hidden");
});

tabCoursesBtn.addEventListener("click", () => {
  tabCoursesBtn.classList.add("active");
  tabStudentsBtn.classList.remove("active");
  coursesTab.classList.remove("hidden");
  studentsTab.classList.add("hidden");
});

// Stats
const studentCountEl = document.getElementById("studentCount");
const courseCountEl = document.getElementById("courseCount");

// STUDENTS UI
const addStudentBtn = document.getElementById("addStudentBtn");
addStudentBtn.addEventListener("click", addStudent);

async function loadStudents() {
  const res = await fetch(STUDENTS_API);
  const students = await res.json();

  studentCountEl.textContent = students.length;

  const tbody = document.getElementById("studentsTable");
  tbody.innerHTML = "";

  students.forEach((s) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id ?? ""}</td>
      <td>${s.name ?? ""}</td>
      <td>${s.department ?? ""}</td>
      <td>${s.year ?? ""}</td>
      <td>${s.email ?? ""}</td>
      <td>${s.phone ?? ""}</td>
      <td>
        <div class="actions">
          <button class="btn-mini" onclick="updateStudentPrompt(${s.id})">Update</button>
          <button class="btn-mini btn-danger" onclick="deleteStudent(${s.id})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addStudent() {
  const student = {
    id: Number(document.getElementById("s_id").value),
    name: document.getElementById("s_name").value,
    department: document.getElementById("s_dept").value,
    year: Number(document.getElementById("s_year").value),
    email: document.getElementById("s_email").value,
    phone: document.getElementById("s_phone").value
  };

  await fetch(STUDENTS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  clearStudentInputs();
  await loadStudents();
}

function clearStudentInputs() {
  ["s_id","s_name","s_dept","s_year","s_email","s_phone"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

async function updateStudentPrompt(id) {
  // Simple UI update prompt (keeps project easy)
  const year = prompt("Enter new year (leave blank to skip):");
  const phone = prompt("Enter new phone (leave blank to skip):");

  const patch = {};
  if (year) patch.year = Number(year);
  if (phone) patch.phone = phone;

  await fetch(`${STUDENTS_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });

  await loadStudents();
}

async function deleteStudent(id) {
  await fetch(`${STUDENTS_API}/${id}`, { method: "DELETE" });
  await loadStudents();
}

// COURSES UI
const addCourseBtn = document.getElementById("addCourseBtn");
addCourseBtn.addEventListener("click", addCourse);

async function loadCourses() {
  const res = await fetch(COURSES_API);
  const courses = await res.json();

  courseCountEl.textContent = courses.length;

  const tbody = document.getElementById("coursesTable");
  tbody.innerHTML = "";

  courses.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id ?? ""}</td>
      <td>${c.title ?? ""}</td>
      <td>${c.trainer ?? ""}</td>
      <td>${c.duration ?? ""}</td>
      <td>
        <div class="actions">
          <button class="btn-mini" onclick="updateCoursePrompt(${c.id})">Update</button>
          <button class="btn-mini btn-danger" onclick="deleteCourse(${c.id})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addCourse() {
  const course = {
    id: Number(document.getElementById("c_id").value),
    title: document.getElementById("c_title").value,
    trainer: document.getElementById("c_trainer").value,
    duration: document.getElementById("c_duration").value
  };

  await fetch(COURSES_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course)
  });

  clearCourseInputs();
  await loadCourses();
}

function clearCourseInputs() {
  ["c_id","c_title","c_trainer","c_duration"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

async function updateCoursePrompt(id) {
  const title = prompt("Enter new course title (leave blank to skip):");
  const trainer = prompt("Enter new trainer (leave blank to skip):");
  const duration = prompt("Enter new duration (leave blank to skip):");

  const patch = {};
  if (title) patch.title = title;
  if (trainer) patch.trainer = trainer;
  if (duration) patch.duration = duration;

  await fetch(`${COURSES_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });

  await loadCourses();
}

async function deleteCourse(id) {
  await fetch(`${COURSES_API}/${id}`, { method: "DELETE" });
  await loadCourses();
}

// Initial load
(async function init() {
  await loadStudents();
  await loadCourses();
})();
