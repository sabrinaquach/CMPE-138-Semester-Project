-- SJSU CMPE 138 FALL 2025 TEAM2
-- Create database, schema, sample data

CREATE DATABASE IF NOT EXISTS cmpe138_project;
USE cmpe138_project;

-- Drop in dependency order for easy reseed (OPTIONAL)
-- SET FOREIGN_KEY_CHECKS=0;
-- DROP TABLE IF EXISTS Application, Job_Posting, Recruiter, Student, Company;
-- SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE IF NOT EXISTS Company (
  Company_ID INT AUTO_INCREMENT PRIMARY KEY,
  Company_Name VARCHAR(100) NOT NULL,
  Website VARCHAR(100),
  Industry VARCHAR(50),
  Description TEXT,
  Location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Recruiter (
  Recruiter_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Company_ID INT NOT NULL,
  Password_Hash VARCHAR(255),
  CONSTRAINT fk_recruiter_company
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Student (
  Student_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Major VARCHAR(100),
  Resume VARCHAR(255),
  University_Name VARCHAR(100),
  Skills VARCHAR(255),
  Password_Hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Job_Posting (
  Job_ID INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  Description TEXT NOT NULL,
  Requirements TEXT NOT NULL,
  Location VARCHAR(100) NOT NULL,
  Salary DECIMAL(10,2),
  Deadline DATE,
  Status VARCHAR(50) DEFAULT 'Open',
  Company_ID INT NOT NULL,
  Recruiter_ID INT NOT NULL,
  CONSTRAINT fk_job_company
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
    ON DELETE CASCADE,
  CONSTRAINT fk_job_recruiter
    FOREIGN KEY (Recruiter_ID) REFERENCES Recruiter(Recruiter_ID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Application (
  Application_ID INT AUTO_INCREMENT PRIMARY KEY,
  Student_ID INT NOT NULL,
  Job_ID INT NOT NULL,
  Status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
  Applied_At DATETIME DEFAULT CURRENT_TIMESTAMP,
  Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Withdrawn_Flag BOOLEAN DEFAULT FALSE,
  Recruiter_ID INT NULL,
  CONSTRAINT fk_app_student
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
    ON DELETE CASCADE,
  CONSTRAINT fk_app_job
    FOREIGN KEY (Job_ID) REFERENCES Job_Posting(Job_ID)
    ON DELETE CASCADE,
  CONSTRAINT fk_app_recruiter
    FOREIGN KEY (Recruiter_ID) REFERENCES Recruiter(Recruiter_ID)
    ON DELETE SET NULL
);

-- Helpful indexes for joins/filters
CREATE INDEX IF NOT EXISTS idx_app_student ON Application(Student_ID);
CREATE INDEX IF NOT EXISTS idx_app_job ON Application(Job_ID);
CREATE INDEX IF NOT EXISTS idx_job_recruiter ON Job_Posting(Recruiter_ID);
CREATE INDEX IF NOT EXISTS idx_job_company ON Job_Posting(Company_ID);

-- Sample Data

INSERT INTO Company (Company_Name, Website, Industry, Description, Location) VALUES
('TechNova', 'https://technova.com', 'Software', 'Enterprise software solutions', 'San Jose, CA'),
('MediHealth', 'https://medihealth.org', 'Healthcare', 'Healthcare data analytics', 'San Francisco, CA'),
('GreenEnergy', 'https://greenenergy.io', 'Energy', 'Renewable energy research', 'Los Angeles, CA');

INSERT INTO Recruiter (Name, Email, Company_ID) VALUES
('Alice Johnson', 'alice@technova.com', 1),
('Bob Lee', 'bob@medihealth.org', 2),
('Carol Davis', 'carol@greenenergy.io', 3);

INSERT INTO Student (Name, Email, Major, Resume, University_Name, Skills) VALUES
('Bob', 'bob@sjsu.edu', 'CS', 'bob_resume.pdf', 'SJSU', 'Python, SQL'),
('Emily Chen', 'emily@sjsu.edu', 'Software Engineering', 'emily_resume.pdf', 'SJSU', 'Java, React'),
('David Nguyen', 'david@sjsu.edu', 'Data Science', 'david_resume.pdf', 'SJSU', 'Python, TensorFlow');

INSERT INTO Job_Posting (Title, Description, Requirements, Location, Salary, Deadline, Status, Company_ID, Recruiter_ID) VALUES
('Backend Developer Intern', 'Assist with building REST APIs', 'Node.js, MySQL', 'San Jose, CA', 25.00, '2025-12-31', 'Open', 1, 1),
('Data Analyst Intern', 'Work with healthcare datasets', 'Python, SQL, Pandas', 'San Francisco, CA', 30.00, '2025-12-31', 'Open', 2, 2),
('Sustainability Research Intern', 'Analyze renewable energy data', 'Excel, R, PowerBI', 'Los Angeles, CA', 28.00, '2025-12-31', 'Open', 3, 3);

INSERT INTO Application (Student_ID, Job_ID, Status, Withdrawn_Flag, Recruiter_ID) VALUES
(1, 1, 'Submitted', FALSE, 1),
(2, 2, 'Interview Scheduled', FALSE, 2),
(3, 3, 'Submitted', FALSE, 3);
