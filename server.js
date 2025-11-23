require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// simple file logger
function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(path.join(process.cwd(), "app.log"), line);
}

// db connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || "cmpe138_project",
  multipleStatements: false,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL.");
  log("Connected to MySQL.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  log(`Server started on port ${PORT}`);
});

/* -------------------------
   AUTH / REGISTRATION
------------------------- */

// Register Student
app.post("/auth/register-student", (req, res) => {
  const { name, email, password, major, resume, university_name, skills } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, password are required" });
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const sql = `
    INSERT INTO Student (Name, Email, Major, Resume, University_Name, Skills, Password_Hash)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, email, major || null, resume || null, university_name || null, skills || null, hash], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Student registered: ${email}`);
    res.json({ message: "Student registered" });
  });
});

// Register Recruiter
app.post("/auth/register-recruiter", (req, res) => {
  const { name, email, password, company_id } = req.body || {};
  if (!name || !email || !password || !company_id) {
    return res.status(400).json({ error: "name, email, password, company_id are required" });
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const sql = `
    INSERT INTO Recruiter (Name, Email, Company_ID, Password_Hash)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [name, email, company_id, hash], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Recruiter registered: ${email}`);
    res.json({ message: "Recruiter registered" });
  });
});

/* -------------------------
   STUDENT ROUTES (CRUD)
------------------------- */

app.post("/students", (req, res) => {
  const { name, email, major, resume, university_name, skills } = req.body || {};
  const sql = `
    INSERT INTO Student (Name, Email, Major, Resume, University_Name, Skills)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, email, major, resume, university_name, skills], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Student added: ${email}`);
    res.json({ message: "Student added successfully" });
  });
});

app.get("/students", (req, res) => {
  db.query("SELECT * FROM Student", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put("/students/:id", (req, res) => {
  const { name, email, major, resume, university_name, skills } = req.body || {};
  const sql = `
    UPDATE Student
    SET Name=?, Email=?, Major=?, Resume=?, University_Name=?, Skills=?
    WHERE Student_ID=?
  `;
  db.query(sql, [name, email, major, resume, university_name, skills, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Student updated: id=${req.params.id}`);
    res.json({ message: "Student updated successfully" });
  });
});

app.delete("/students/:id", (req, res) => {
  db.query("DELETE FROM Student WHERE Student_ID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Student deleted: id=${req.params.id}`);
    res.json({ message: "Student deleted successfully" });
  });
});

/* -------------------------
   COMPANY ROUTES (CRUD)
------------------------- */

app.post("/companies", (req, res) => {
  const { company_name, website, industry, description, location } = req.body || {};
  const sql = `
    INSERT INTO Company (Company_Name, Website, Industry, Description, Location)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [company_name, website, industry, description, location], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Company added: ${company_name}`);
    res.json({ message: "Company added successfully" });
  });
});

app.get("/companies", (req, res) => {
  db.query("SELECT * FROM Company", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put("/companies/:id", (req, res) => {
  const { company_name, website, industry, description, location } = req.body || {};
  const sql = `
    UPDATE Company
    SET Company_Name=?, Website=?, Industry=?, Description=?, Location=?
    WHERE Company_ID=?
  `;
  db.query(sql, [company_name, website, industry, description, location, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Company updated: id=${req.params.id}`);
    res.json({ message: "Company updated successfully" });
  });
});

app.delete("/companies/:id", (req, res) => {
  db.query("DELETE FROM Company WHERE Company_ID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Company deleted: id=${req.params.id}`);
    res.json({ message: "Company deleted successfully" });
  });
});

/* -------------------------
   RECRUITER ROUTES (CRUD)
------------------------- */

app.post("/recruiters", (req, res) => {
  const { name, email, company_id } = req.body || {};
  const sql = `
    INSERT INTO Recruiter (Name, Email, Company_ID)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [name, email, company_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Recruiter added: ${email}`);
    res.json({ message: "Recruiter added successfully" });
  });
});

app.get("/recruiters", (req, res) => {
  const sql = `
    SELECT R.Recruiter_ID, R.Name, R.Email, C.Company_Name
    FROM Recruiter R
    LEFT JOIN Company C ON R.Company_ID = C.Company_ID
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put("/recruiters/:id", (req, res) => {
  const { name, email, company_id } = req.body || {};
  const sql = `
    UPDATE Recruiter
    SET Name=?, Email=?, Company_ID=?
    WHERE Recruiter_ID=?
  `;
  db.query(sql, [name, email, company_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Recruiter updated: id=${req.params.id}`);
    res.json({ message: "Recruiter updated successfully" });
  });
});

app.delete("/recruiters/:id", (req, res) => {
  db.query("DELETE FROM Recruiter WHERE Recruiter_ID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Recruiter deleted: id=${req.params.id}`);
    res.json({ message: "Recruiter deleted successfully" });
  });
});

/* -------------------------
   JOB POSTING ROUTES (CRUD)
------------------------- */

app.post("/jobs", (req, res) => {
  const { title, description, requirements, location, salary, deadline, status, company_id, recruiter_id } = req.body || {};
  const sql = `
    INSERT INTO Job_Posting (Title, Description, Requirements, Location, Salary, Deadline, Status, Company_ID, Recruiter_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [title, description, requirements, location, salary || null, deadline || null, status || "Open", company_id, recruiter_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      log(`Job posted: ${title}`);
      res.json({ message: "Job posting added successfully" });
    }
  );
});

app.get("/jobs", (req, res) => {
  const sql = `
    SELECT J.Job_ID, J.Title, J.Description, J.Requirements, J.Location,
           J.Salary, J.Deadline, J.Status, C.Company_Name, R.Name AS Recruiter_Name
    FROM Job_Posting J
    LEFT JOIN Company C ON J.Company_ID = C.Company_ID
    LEFT JOIN Recruiter R ON J.Recruiter_ID = R.Recruiter_ID
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put("/jobs/:id", (req, res) => {
  const { title, description, requirements, location, salary, deadline, status } = req.body || {};
  const sql = `
    UPDATE Job_Posting
    SET Title=?, Description=?, Requirements=?, Location=?, Salary=?, Deadline=?, Status=?
    WHERE Job_ID=?
  `;
  db.query(sql, [title, description, requirements, location, salary, deadline, status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Job updated: id=${req.params.id}`);
    res.json({ message: "Job posting updated successfully" });
  });
});

app.delete("/jobs/:id", (req, res) => {
  db.query("DELETE FROM Job_Posting WHERE Job_ID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Job deleted: id=${req.params.id}`);
    res.json({ message: "Job posting deleted successfully" });
  });
});

/* -------------------------
   APPLICATION ROUTES (CRUD)
------------------------- */

app.post("/applications", (req, res) => {
  const { student_id, job_id } = req.body || {};
  const sql = `
    INSERT INTO Application (Student_ID, Job_ID, Status, Withdrawn_Flag)
    VALUES (?, ?, 'Submitted', FALSE)
  `;
  db.query(sql, [student_id, job_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Application submitted: student=${student_id}, job=${job_id}`);
    res.json({ message: "Application submitted successfully" });
  });
});

app.get("/applications", (req, res) => {
  const sql = `
    SELECT A.Application_ID, S.Name AS Student_Name, J.Title AS Job_Title,
           A.Status, A.Applied_At, A.Updated_At, A.Withdrawn_Flag
    FROM Application A
    JOIN Student S ON A.Student_ID = S.Student_ID
    JOIN Job_Posting J ON A.Job_ID = J.Job_ID
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put("/applications/:id", (req, res) => {
  const { status, withdrawn_flag } = req.body || {};
  const sql = `
    UPDATE Application
    SET Status=?, Withdrawn_Flag=?, Updated_At=NOW()
    WHERE Application_ID=?
  `;
  db.query(sql, [status || "Submitted", !!withdrawn_flag, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Application updated: id=${req.params.id}, status=${status}, withdrawn=${!!withdrawn_flag}`);
    res.json({ message: "Application updated successfully" });
  });
});

// Withdraw convenience route
app.put("/applications/:id/withdraw", (req, res) => {
  const sql = "UPDATE Application SET Withdrawn_Flag=TRUE, Updated_At=NOW() WHERE Application_ID=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Application withdrawn: id=${req.params.id}`);
    res.json({ message: "Application withdrawn successfully" });
  });
});

app.delete("/applications/:id", (req, res) => {
  db.query("DELETE FROM Application WHERE Application_ID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(`Application deleted: id=${req.params.id}`);
    res.json({ message: "Application deleted successfully" });
  });
});

// basic 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});
