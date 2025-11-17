require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

//database connection config
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || "cmpe138_project"
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

//connect to mysql database
db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

//student routes
//CREATE a student
app.post("/students", (req, res) => {
    const { name, email, major, resume, university_name, skills } = req.body;
    const sql = `
        INSERT INTO Student (Name, Email, Major, Resume, University_Name, Skills)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [name, email, major, resume, university_name, skills], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student added successfully" });
    });
});

//READ all students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM Student", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//UPDATE a student
app.put("/students/:id", (req, res) => {
    const { name, email, major, resume, university_name, skills } = req.body;
    const sql = `
        UPDATE Student
        SET Name=?, Email=?, Major=?, Resume=?, University_Name=?, Skills=?
        WHERE Student_ID=?
    `;
    db.query(sql, [name, email, major, resume, university_name, skills, req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student updated successfully" });
    });
});

//DELETE a student
app.delete("/students/:id", (req, res) => {
    db.query("DELETE FROM Student WHERE Student_ID=?", [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student deleted successfully" });
    });
});


//company routes
//CREATE company
app.post("/companies", (req, res) => {
    const { company_name, website, industry, description, location } = req.body;
    const sql = `
        INSERT INTO Company (Company_Name, Website, Industry, Description, Location)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [company_name, website, industry, description, location], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Company added successfully" });
    });
});

//READ all companies
app.get("/companies", (req, res) => {
    db.query("SELECT * FROM Company", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//UPDATE company
app.put("/companies/:id", (req, res) => {
    const { company_name, website, industry, description, location } = req.body;
    const sql = `
        UPDATE Company
        SET Company_Name=?, Website=?, Industry=?, Description=?, Location=?
        WHERE Company_ID=?
    `;
    db.query(sql, [company_name, website, industry, description, location, req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Company updated successfully" });
    });
});

//DELETE company
app.delete("/companies/:id", (req, res) => {
    db.query("DELETE FROM Company WHERE Company_ID=?", [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Company deleted successfully" });
    });
});

//recruiter routes
//CREATE recruiter
app.post("/recruiters", (req, res) => {
    const { name, email, company_id } = req.body;
    const sql = `
        INSERT INTO Recruiter (Name, Email, Company_ID)
        VALUES (?, ?, ?)
    `;
    db.query(sql, [name, email, company_id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Recruiter added successfully" });
    });
});

//READ recruiters
app.get("/recruiters", (req, res) => {
    const sql = `
        SELECT R.Recruiter_ID, R.Name, R.Email, C.Company_Name
        FROM Recruiter R
        LEFT JOIN Company C ON R.Company_ID = C.Company_ID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//UPDATE recruiter
app.put("/recruiters/:id", (req, res) => {
    const { name, email, company_id } = req.body;
    const sql = `
        UPDATE Recruiter
        SET Name=?, Email=?, Company_ID=?
        WHERE Recruiter_ID=?
    `;
    db.query(sql, [name, email, company_id, req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Recruiter updated successfully" });
    });
});

//DELETE recruiter
app.delete("/recruiters/:id", (req, res) => {
    db.query("DELETE FROM Recruiter WHERE Recruiter_ID=?", [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Recruiter deleted successfully" });
    });
});


//job posting routes
//CREATE job posting
app.post("/jobs", (req, res) => {
    const { title, description, requirements, location, salary, deadline, status, company_id, recruiter_id } = req.body;
    const sql = `
        INSERT INTO Job_Posting (Title, Description, Requirements, Location, Salary, Deadline, Status, Company_ID, Recruiter_ID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [title, description, requirements, location, salary, deadline, status, company_id, recruiter_id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Job posting added successfully" });
    });
});

//READ all jobs
app.get("/jobs", (req, res) => {
    const sql = `
        SELECT J.Job_ID, J.Title, J.Description, J.Requirements, J.Location,
            J.Salary, J.Deadline, J.Status, C.Company_Name, R.Name AS Recruiter_Name
        FROM Job_Posting J
        LEFT JOIN Company C ON J.Company_ID = C.Company_ID
        LEFT JOIN Recruiter R ON J.Recruiter_ID = R.Recruiter_ID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//UPDATE job
app.put("/jobs/:id", (req, res) => {
    const { title, description, requirements, location, salary, deadline, status } = req.body;
    const sql = `
        UPDATE Job_Posting
        SET Title=?, Description=?, Requirements=?, Location=?, Salary=?, Deadline=?, Status=?
        WHERE Job_ID=?
    `;
    db.query(sql, [title, description, requirements, location, salary, deadline, status, req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Job posting updated successfully" });
    });
});

//DELETE job
app.delete("/jobs/:id", (req, res) => {
    db.query("DELETE FROM Job_Posting WHERE Job_ID=?", [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Job posting deleted successfully" });
    });
});

//application routes
//CREATE application
app.post("/applications", (req, res) => {
    const { student_id, job_id, status, withdrawn_flag } = req.body;
    const sql = `
        INSERT INTO Application (Student_ID, Job_ID, Status, Withdrawn_Flag)
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [student_id, job_id, status || "Submitted", withdrawn_flag || false], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Application submitted successfully" });
    });
});

//READ all applications
app.get("/applications", (req, res) => {
    const sql = `
        SELECT A.Application_ID, S.Name AS Student_Name, J.Title AS Job_Title,
            A.Status, A.Applied_At, A.Updated_At, A.Withdrawn_Flag
        FROM Application A
        JOIN Student S ON A.Student_ID = S.Student_ID
        JOIN Job_Posting J ON A.Job_ID = J.Job_ID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//UPDATE application
app.put("/applications/:id", (req, res) => {
    const { status, withdrawn_flag } = req.body;
    const sql = `
        UPDATE Application
        SET Status=?, Withdrawn_Flag=?, Updated_At=NOW()
        WHERE Application_ID=?
    `;
    db.query(sql, [status, withdrawn_flag, req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Application updated successfully" });
    });
});

//DELETE application
app.delete("/applications/:id", (req, res) => {
    db.query("DELETE FROM Application WHERE Application_ID=?", [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Application deleted successfully" });
    });
});

//start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
