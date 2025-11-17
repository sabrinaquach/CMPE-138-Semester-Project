-- SJSU CMPE 138 FALL 2025 TEAM2
-- Create sample data and tables

CREATE TABLE IF NOT EXISTS Company (
  Company_ID INT AUTO_INCREMENT PRIMARY KEY,
  Company_Name VARCHAR(100),
  Website VARCHAR(100),
  Industry VARCHAR(50),
  Description TEXT,
  Location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Recruiter (
  Recruiter_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100),
  Email VARCHAR(100),
  Company_ID INT,
  FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE IF NOT EXISTS Student (
  Student_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100),
  Email VARCHAR(100),
  Major VARCHAR(100),
  Resume VARCHAR(255),
  University_Name VARCHAR(100),
  Skills VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Job_Posting (
  Job_ID INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(100),
  Description TEXT,
  Requirements TEXT,
  Location VARCHAR(100),
  Salary DECIMAL(10,2),
  Deadline DATE,
  Status VARCHAR(50),
  Company_ID INT,
  Recruiter_ID INT,
  FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID),
  FOREIGN KEY (Recruiter_ID) REFERENCES Recruiter(Recruiter_ID)
);

CREATE TABLE IF NOT EXISTS Application (
  Application_ID INT AUTO_INCREMENT PRIMARY KEY,
  Student_ID INT,
  Job_ID INT,
  Status VARCHAR(50),
  Applied_At DATETIME DEFAULT CURRENT_TIMESTAMP,
  Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Withdrawn_Flag BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID),
  FOREIGN KEY (Job_ID) REFERENCES Job_Posting(Job_ID)
);

-- Sample Data

-- Companies
INSERT INTO Company (Company_Name, Website, Industry, Description, Location)
VALUES
('TechNova', 'https://technova.com', 'Software', 'Enterprise software solutions', 'San Jose, CA'),
('MediHealth', 'https://medihealth.org', 'Healthcare', 'Healthcare data analytics', 'San Francisco, CA'),
('GreenEnergy', 'https://greenenergy.io', 'Energy', 'Renewable energy research', 'Los Angeles, CA');

-- Recruiters
INSERT INTO Recruiter (Name, Email, Company_ID)
VALUES
('Alice Johnson', 'alice@technova.com', 1),
('Bob Lee', 'bob@medihealth.org', 2),
('Carol Davis', 'carol@greenenergy.io', 3);

-- Students
INSERT INTO Student (Name, Email, Major, Resume, University_Name, Skills)
VALUES
('Bob', 'bob@sjsu.edu', 'CS', 'bob_resume.pdf', 'SJSU', 'Python, SQL'),
('Emily Chen', 'emily@sjsu.edu', 'Software Engineering', 'emily_resume.pdf', 'SJSU', 'Java, React'),
('David Nguyen', 'david@sjsu.edu', 'Data Science', 'david_resume.pdf', 'SJSU', 'Python, TensorFlow');

-- Job Postings
INSERT INTO Job_Posting (Title, Description, Requirements, Location, Salary, Deadline, Status, Company_ID, Recruiter_ID)
VALUES
('Backend Developer Intern', 'Assist with building REST APIs', 'Node.js, MySQL', 'San Jose, CA', 25.00, '2025-12-31', 'Open', 1, 1),
('Data Analyst Intern', 'Work with healthcare datasets', 'Python, SQL, Pandas', 'San Francisco, CA', 30.00, '2025-12-31', 'Open', 2, 2),
('Sustainability Research Intern', 'Analyze renewable energy data', 'Excel, R, PowerBI', 'Los Angeles, CA', 28.00, '2025-12-31', 'Open', 3, 3);

-- Applications
INSERT INTO Application (Student_ID, Job_ID, Status, Withdrawn_Flag)
VALUES
(1, 1, 'Submitted', FALSE),
(2, 2, 'Interview Scheduled', FALSE),
(3, 3, 'Submitted', FALSE);
