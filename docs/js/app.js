const STUDENTS_API = "/api/students";
const COURSES_API = "/api/courses";

// Tabs
const tabStudentsBtn = document.getElementById("tabStudentsBtn");
const tabCoursesBtn = document.getElementById("tabCoursesBtn");
const studentsTab = document.getElementById("studentsTab");
const coursesTab = document.getElementById("coursesTab");

// Mobile sidebar toggle
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");

function openSidebar() {
  if (!sidebar || !overlay) return;
  sidebar.classList.add("open");
  overlay.classList.add("show");
}

function closeSidebar() {
  if (!sidebar || !overlay) return;
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

// Hamburger + overlay click handlers
if (menuBtn) menuBtn.addEventListener("click", openSidebar);
if (overlay) overlay.addEventListener("click", closeSidebar);

// Tab switching
if (tabStudentsBtn && tabCoursesBtn && studentsTab && coursesTab) {
  tabStudentsBtn.addEventListener("click", () => {
    tabStudentsBtn.classList.add("active");
    tabCoursesBtn.classList.remove("active");
    studentsTab.classList.remove("hidden");
    coursesTab.classList.add("hidden");

    // close sidebar on mobile
    closeSidebar();
  });

  tabCoursesBtn.addEventListener("click", () => {
    tabCoursesBtn.classList.add("active");
    tabStudentsBtn.classList.remove("active");
    coursesTab.classList.remove("hidden");
    studentsTab.classList.add("hidden");

    // close sidebar on mobile
    closeSidebar();
  });
}

// Stats
const studentCountEl = document.getElementById("studentCount");
const courseCountEl = document.getElementById("courseCount");

// -------------------- STUDENTS --------------------
const addStudentBtn = document.getElementById("addStudentBtn");
if (addStudentBtn) addStudentBtn.addEventListener("click", addStudent);

async function loadStudents() {
  try {
    const res = await fetch(STUDENTS_API);
    const students = await res.json();

    if (studentCountEl) studentCountEl.textContent = students.length;

    const tbody = document.getElementById("studentsTable");
    if (!tbody) return;

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
  } catch (err) {
    console.error("Failed to load students:", err);
  }
}

async function addStudent() {
  const idVal = document.getElementById("s_id")?.value;
  const yearVal = document.getElementById("s_year")?.value;

  const student = {
    id: Number(idVal),
    name: document.getElementById("s_name")?.value || "",
    department: document.getElementById("s_dept")?.value || "",
    year: Number(yearVal),
    email: document.getElementById("s_email")?.value || "",
    phone: document.getElementById("s_phone")?.value || ""
  };

  // Minimal validation
  if (!student.id || !student.name) {
    alert("Please enter at least Student ID and Name.");
    return;
  }

  try {
    await fetch(STUDENTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });

    clearStudentInputs();
    await loadStudents();
  } catch (err) {
    console.error("Failed to add student:", err);
  }
}

function clearStudentInputs() {
  ["s_id", "s_name", "s_dept", "s_year", "s_email", "s_phone"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

window.updateStudentPrompt = async function updateStudentPrompt(id) {
  const year = prompt("Enter new year (leave blank to skip):");
  const phone = prompt("Enter new phone (leave blank to skip):");

  const patch = {};
  if (year) patch.year = Number(year);
  if (phone) patch.phone = phone;

  // If user left both blank, do nothing
  if (Object.keys(patch).length === 0) return;

  try {
    await fetch(`${STUDENTS_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });

    await loadStudents();
  } catch (err) {
    console.error("Failed to update student:", err);
  }
};

window.deleteStudent = async function deleteStudent(id) {
  try {
    await fetch(`${STUDENTS_API}/${id}`, { method: "DELETE" });
    await loadStudents();
  } catch (err) {
    console.error("Failed to delete student:", err);
  }
};

// -------------------- COURSES --------------------
const addCourseBtn = document.getElementById("addCourseBtn");
if (addCourseBtn) addCourseBtn.addEventListener("click", addCourse);

async function loadCourses() {
  try {
    const res = await fetch(COURSES_API);
    const courses = await res.json();

    if (courseCountEl) courseCountEl.textContent = courses.length;

    const tbody = document.getElementById("coursesTable");
    if (!tbody) return;

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
  } catch (err) {
    console.error("Failed to load courses:", err);
  }
}

async function addCourse() {
  const idVal = document.getElementById("c_id")?.value;

  const course = {
    id: Number(idVal),
    title: document.getElementById("c_title")?.value || "",
    trainer: document.getElementById("c_trainer")?.value || "",
    duration: document.getElementById("c_duration")?.value || ""
  };

  if (!course.id || !course.title) {
    alert("Please enter at least Course ID and Course Title.");
    return;
  }

  try {
    await fetch(COURSES_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course)
    });

    clearCourseInputs();
    await loadCourses();
  } catch (err) {
    console.error("Failed to add course:", err);
  }
}

function clearCourseInputs() {
  ["c_id", "c_title", "c_trainer", "c_duration"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

window.updateCoursePrompt = async function updateCoursePrompt(id) {
  const title = prompt("Enter new course title (leave blank to skip):");
  const trainer = prompt("Enter new trainer (leave blank to skip):");
  const duration = prompt("Enter new duration (leave blank to skip):");

  const patch = {};
  if (title) patch.title = title;
  if (trainer) patch.trainer = trainer;
  if (duration) patch.duration = duration;

  if (Object.keys(patch).length === 0) return;

  try {
    await fetch(`${COURSES_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });

    await loadCourses();
  } catch (err) {
    console.error("Failed to update course:", err);
  }
};

window.deleteCourse = async function deleteCourse(id) {
  try {
    await fetch(`${COURSES_API}/${id}`, { method: "DELETE" });
    await loadCourses();
  } catch (err) {
    console.error("Failed to delete course:", err);
  }
};

// Initial load
(async function init() {
  await loadStudents();
  await loadCourses();
})();
