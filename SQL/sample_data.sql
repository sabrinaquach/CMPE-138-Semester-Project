-- SJSU CMPE 138 FALL 2025 TEAM2
-- Fresh schema + sample data (indexes defined inside CREATE TABLE)

-- Start clean
DROP DATABASE IF EXISTS cmpe138_project;
CREATE DATABASE cmpe138_project;
USE cmpe138_project;

-- Companies
CREATE TABLE Company (
  Company_ID INT AUTO_INCREMENT PRIMARY KEY,
  Company_Name VARCHAR(100) NOT NULL,
  Website VARCHAR(100),
  Industry VARCHAR(50),
  Description TEXT,
  Location VARCHAR(100)
) ENGINE=InnoDB;

-- Recruiters
CREATE TABLE Recruiter (
  Recruiter_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Company_ID INT,
  CONSTRAINT fk_recruiter_company
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  KEY idx_recruiter_company (Company_ID)
) ENGINE=InnoDB;

-- Students
CREATE TABLE Student (
  Student_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Major VARCHAR(100) NOT NULL,
  Resume VARCHAR(255),
  University_Name VARCHAR(100),
  Skills VARCHAR(255)
) ENGINE=InnoDB;

-- Job postings
CREATE TABLE Job_Posting (
  Job_ID INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  Description TEXT NOT NULL,
  Requirements TEXT NOT NULL,
  Location VARCHAR(100) NOT NULL,
  Salary DECIMAL(10,2),
  Deadline DATE NOT NULL,
  Status VARCHAR(50) DEFAULT 'Open',
  Company_ID INT,
  Recruiter_ID INT,
  CONSTRAINT fk_job_company
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_job_recruiter
    FOREIGN KEY (Recruiter_ID) REFERENCES Recruiter(Recruiter_ID)
    ON DELETE SET NULL ON UPDATE CASCADE,
  KEY idx_job_company (Company_ID),
  KEY idx_job_recruiter (Recruiter_ID),
  KEY idx_job_status (Status)
) ENGINE=InnoDB;

-- Applications
CREATE TABLE Application (
  Application_ID INT AUTO_INCREMENT PRIMARY KEY,
  Student_ID INT NOT NULL,
  Job_ID INT NOT NULL,
  Status VARCHAR(50) NOT NULL,
  Applied_At DATETIME DEFAULT CURRENT_TIMESTAMP,
  Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Withdrawn_Flag BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_app_student
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_app_job
    FOREIGN KEY (Job_ID) REFERENCES Job_Posting(Job_ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_app_student (Student_ID),
  KEY idx_app_job (Job_ID),
  KEY idx_app_status (Status)
) ENGINE=InnoDB;

-- Sample data
INSERT INTO Company (Company_Name, Website, Industry, Description, Location) VALUES
('TechNova',   'https://technova.com',   'Software',  'Enterprise software solutions',   'San Jose, CA'),
('MediHealth', 'https://medihealth.org', 'Healthcare','Healthcare data analytics',       'San Francisco, CA'),
('GreenEnergy','https://greenenergy.io', 'Energy',    'Renewable energy research',       'Los Angeles, CA');

INSERT INTO Recruiter (Name, Email, Company_ID) VALUES
('Alice Johnson', 'alice@technova.com', 1),
('Bob Lee',       'bob@medihealth.org', 2),
('Carol Davis',   'carol@greenenergy.io', 3);

INSERT INTO Student (Name, Email, Major, Resume, University_Name, Skills) VALUES
('Bob',         'bob@sjsu.edu',    'CS',                   'bob_resume.pdf',    'SJSU', 'Python, SQL'),
('Emily Chen',  'emily@sjsu.edu',  'Software Engineering', 'emily_resume.pdf',  'SJSU', 'Java, React'),
('David Nguyen','david@sjsu.edu',  'Data Science',         'david_resume.pdf',  'SJSU', 'Python, TensorFlow');

INSERT INTO Job_Posting (Title, Description, Requirements, Location, Salary, Deadline, Status, Company_ID, Recruiter_ID) VALUES
('Backend Developer Intern',       'Assist with building REST APIs',   'Node.js, MySQL',            'San Jose, CA',       25.00, '2025-12-31', 'Open', 1, 1),
('Data Analyst Intern',            'Work with healthcare datasets',    'Python, SQL, Pandas',       'San Francisco, CA',  30.00, '2025-12-31', 'Open', 2, 2),
('Sustainability Research Intern', 'Analyze renewable energy data',    'Excel, R, PowerBI',         'Los Angeles, CA',    28.00, '2025-12-31', 'Open', 3, 3);

INSERT INTO Application (Student_ID, Job_ID, Status, Withdrawn_Flag) VALUES
(1, 1, 'Submitted', FALSE),
(2, 2, 'Interview Scheduled', FALSE),
(3, 3, 'Submitted', FALSE);
