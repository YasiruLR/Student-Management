const { executeQuery } = require('../config/database');

// Get all students with optional filtering
const getStudents = async (req, res) => {
  try {
    const { search, course, status, sortBy = 'first_name', sortOrder = 'ASC' } = req.query;
    
    let query = `
      SELECT s.*, u.username as created_by_username 
      FROM students s 
      LEFT JOIN users u ON s.created_by = u.id 
      WHERE 1=1
    `;
    let params = [];

    if (search) {
      query += ` AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ? OR s.course LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (course) {
      query += ` AND s.course = ?`;
      params.push(course);
    }

    if (status) {
      query += ` AND s.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY s.${sortBy} ${sortOrder}`;

    const students = await executeQuery(query, params);
    
    // Get history for each student
    for (let student of students) {
      const history = await executeQuery(
        `SELECT sh.*, u.username as performed_by_username 
         FROM student_history sh 
         LEFT JOIN users u ON sh.performed_by = u.id 
         WHERE sh.student_id = ? 
         ORDER BY sh.action_date DESC`,
        [student.id]
      );
      student.history = history;
    }

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const students = await executeQuery(
      `SELECT s.*, u.username as created_by_username 
       FROM students s 
       LEFT JOIN users u ON s.created_by = u.id 
       WHERE s.id = ?`,
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = students[0];

    // Get student history
    const history = await executeQuery(
      `SELECT sh.*, u.username as performed_by_username 
       FROM student_history sh 
       LEFT JOIN users u ON sh.performed_by = u.id 
       WHERE sh.student_id = ? 
       ORDER BY sh.action_date DESC`,
      [id]
    );

    student.history = history;

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new student
const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      course,
      grade = 'A',
      status = 'Active'
    } = req.body;

    if (!firstName || !lastName || !email || !course) {
      return res.status(400).json({ error: 'First name, last name, email, and course are required' });
    }

    // Check if email already exists
    const existingStudents = await executeQuery(
      'SELECT id FROM students WHERE email = ?',
      [email]
    );

    if (existingStudents.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const enrollmentDate = new Date().toISOString().split('T')[0];

    // Insert student
    const result = await executeQuery(
      `INSERT INTO students (first_name, last_name, email, phone, date_of_birth, address, course, grade, status, enrollment_date, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, dateOfBirth, address, course, grade, status, enrollmentDate, req.user.id]
    );

    // Add history record
    await executeQuery(
      'INSERT INTO student_history (student_id, action, performed_by, new_values) VALUES (?, ?, ?, ?)',
      [
        result.insertId,
        'Student Enrolled',
        req.user.id,
        JSON.stringify({ course, grade, status })
      ]
    );

    res.status(201).json({
      message: 'Student created successfully',
      studentId: result.insertId
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Get current student data
    const currentStudents = await executeQuery(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );

    if (currentStudents.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const currentStudent = currentStudents[0];

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    
    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'address', 'course', 'grade', 'status'];
    
    for (const field of allowedFields) {
      const camelCaseField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      if (updateData[camelCaseField] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[camelCaseField]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateValues.push(id);

    await executeQuery(
      `UPDATE students SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Add history record
    await executeQuery(
      'INSERT INTO student_history (student_id, action, performed_by, old_values, new_values) VALUES (?, ?, ?, ?, ?)',
      [
        id,
        'Student Information Updated',
        req.user.id,
        JSON.stringify(currentStudent),
        JSON.stringify(updateData)
      ]
    );

    res.json({ message: 'Student updated successfully' });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete student (admin only)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const students = await executeQuery(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete student (history will be deleted automatically due to CASCADE)
    await executeQuery('DELETE FROM students WHERE id = ?', [id]);

    res.json({ message: 'Student deleted successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get student statistics
const getStudentStats = async (req, res) => {
  try {
    const stats = {};

    // Total students
    const totalResult = await executeQuery('SELECT COUNT(*) as total FROM students');
    stats.total = totalResult[0].total;

    // Active students
    const activeResult = await executeQuery('SELECT COUNT(*) as active FROM students WHERE status = "Active"');
    stats.active = activeResult[0].active;

    // Inactive students
    stats.inactive = stats.total - stats.active;

    // Grade distribution
    const gradeResult = await executeQuery(
      'SELECT grade, COUNT(*) as count FROM students GROUP BY grade ORDER BY grade'
    );
    stats.gradeDistribution = gradeResult.reduce((acc, row) => {
      acc[row.grade] = row.count;
      return acc;
    }, {});

    // Course distribution
    const courseResult = await executeQuery(
      'SELECT course, COUNT(*) as count FROM students GROUP BY course ORDER BY count DESC'
    );
    stats.courseDistribution = courseResult.reduce((acc, row) => {
      acc[row.course] = row.count;
      return acc;
    }, {});

    res.json(stats);

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
};
