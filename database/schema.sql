-- Student Management System Database Schema
-- Run this script in MySQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS student_management_system;
USE student_management_system;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL,
    email VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    course VARCHAR(100),
    grade VARCHAR(5),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    enrollment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Student history table for tracking changes
CREATE TABLE IF NOT EXISTS student_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    performed_by INT NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values JSON,
    new_values JSON,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, role, email, first_name, last_name) 
VALUES ('admin', '$2b$10$rQtNkQfJvb5JGDnLl9nCKuXHEJ.7Xw.Zf5Kt5QgVZ4xFjH3Sd8X.K', 'admin', 'admin@studentms.com', 'System', 'Administrator')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Insert default employee user (password: emp123)
INSERT INTO users (username, password, role, email, first_name, last_name) 
VALUES ('employee', '$2b$10$rQtNkQfJvb5JGDnLl9nCKuXHEJ.7Xw.Zf5Kt5QgVZ4xFjH3Sd8X.K', 'employee', 'employee@studentms.com', 'Staff', 'Member')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Insert sample students
INSERT IGNORE INTO students (first_name, last_name, email, phone, date_of_birth, address, course, grade, status, enrollment_date, created_by) 
VALUES 
('John', 'Doe', 'john.doe@email.com', '123-456-7890', '2000-01-15', '123 Main St, City, State', 'Computer Science', 'A', 'Active', '2023-09-01', 1),
('Jane', 'Smith', 'jane.smith@email.com', '098-765-4321', '1999-05-20', '456 Oak Ave, City, State', 'Business Administration', 'B+', 'Active', '2023-08-15', 1),
('Michael', 'Johnson', 'michael.j@email.com', '555-123-4567', '2001-03-10', '789 Pine Rd, City, State', 'Engineering', 'A-', 'Active', '2023-09-10', 1),
('Emily', 'Davis', 'emily.davis@email.com', '444-987-6543', '2000-11-25', '321 Elm St, City, State', 'Psychology', 'B', 'Active', '2023-08-20', 1);

-- Insert sample history records
INSERT IGNORE INTO student_history (student_id, action, performed_by, old_values, new_values) 
VALUES 
(1, 'Student Enrolled', 1, NULL, JSON_OBJECT('course', 'Computer Science', 'grade', 'A')),
(1, 'Grade Updated', 1, JSON_OBJECT('grade', 'B+'), JSON_OBJECT('grade', 'A')),
(2, 'Student Enrolled', 1, NULL, JSON_OBJECT('course', 'Business Administration', 'grade', 'B+')),
(3, 'Student Enrolled', 1, NULL, JSON_OBJECT('course', 'Engineering', 'grade', 'A-')),
(4, 'Student Enrolled', 1, NULL, JSON_OBJECT('course', 'Psychology', 'grade', 'B'));

-- Create indexes for better performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_course ON students(course);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_student_history_student_id ON student_history(student_id);
CREATE INDEX idx_student_history_date ON student_history(action_date);

-- Show table structure
DESCRIBE users;
DESCRIBE students;
DESCRIBE student_history;
