# School Database Design

## 1. Tables and Their Purpose

### Students
The `students` table stores information about each student. It contains `student_id` as the primary key, `name` for the student's full name, and `email` for the student's email address. The email field is unique to prevent two students from registering with the same email.

### Courses
The `courses` table stores information about courses offered by the school. It contains `course_id` as the primary key, `course_name` for the course title, and `description` for additional information about the course.

### Enrolments
The `enrolments` table records which students have enrolled in which courses. It contains `enrolment_id` as the primary key, `student_id` and `course_id` as foreign keys, and `grade` to store the student's result for that course. A unique constraint on `student_id` and `course_id` prevents the same student from enrolling in the same course more than once.

## 2. Relationships Between the Tables

There is a one-to-many relationship between `students` and `enrolments` because one student can have multiple enrolment records, while each enrolment belongs to one student.

There is also a one-to-many relationship between `courses` and `enrolments` because one course can have multiple students enrolled, while each enrolment refers to one course.

Together, students and courses have a many-to-many relationship: one student can take several courses, and one course can have several students. The `enrolments` table is needed as a join table to connect the two tables. It also stores information about the relationship, such as the student's grade in a particular course.

## 3. Recommended Index

I would add an index on `enrolments(course_id)` to improve searches for students enrolled in a particular course and help queries that count students per course. This can be created with:

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
```

## 4. SQL or NoSQL?

I would choose SQL for this school system because students, courses, and enrolments have clear relationships and structured data. A relational database such as SQLite supports primary keys, foreign keys, unique constraints, and queries using JOIN and GROUP BY. These features help maintain data accuracy and prevent invalid enrolments. SQL is therefore a suitable choice for this system.
