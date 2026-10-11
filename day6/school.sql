-- Day 6 Assignment: School Database

-- Enable foreign key enforcement in SQLite
PRAGMA foreign_keys = ON;

-- Remove existing tables so the script can be run again
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- 1. Create students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    description TEXT
);

-- 3. Create enrolments table
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),

    UNIQUE (student_id, course_id)
);

-- Insert at least 3 students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Amina Otieno', 'amina@example.com'),
(2, 'Brian Kamau', 'brian@example.com'),
(3, 'Carol Wanjiku', 'carol@example.com'),
(4, 'David Mwangi', 'david@example.com');

-- Insert at least 3 courses
INSERT INTO courses (course_id, course_name, description) VALUES
(1, 'Web Development', 'Learn HTML, CSS and JavaScript'),
(2, 'Database Systems', 'Learn SQL and database design'),
(3, 'Computer Networks', 'Learn computer networking basics');

-- Insert at least 5 enrolments
INSERT INTO enrolments
    (enrolment_id, student_id, course_id, grade)
VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'B'),
(4, 2, 3, 'A'),
(5, 3, 2, 'A');

-- QUERY 1: All courses for one student, by name
SELECT
    students.name,
    courses.course_name,
    enrolments.grade
FROM enrolments
JOIN students
    ON enrolments.student_id = students.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE students.name = 'Amina Otieno';

-- QUERY 2: All students on one course
SELECT
    students.name,
    courses.course_name
FROM enrolments
JOIN students
    ON enrolments.student_id = students.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE courses.course_name = 'Web Development';

-- QUERY 3: Number of students per course, including courses with zero students
SELECT
    courses.course_name,
    COUNT(enrolments.student_id) AS number_of_students
FROM courses
LEFT JOIN enrolments
    ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.course_name;

-- QUERY 4: Students who have no enrolments
SELECT
    students.student_id,
    students.name,
    students.email
FROM students
LEFT JOIN enrolments
    ON students.student_id = enrolments.student_id
WHERE enrolments.enrolment_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 2;

-- Check that the grade update worked
SELECT *
FROM enrolments
WHERE enrolment_id = 2;