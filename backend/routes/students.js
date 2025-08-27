const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
} = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all students with optional filtering and search
router.get('/', getStudents);

// Get student statistics
router.get('/stats', getStudentStats);

// Get single student by ID
router.get('/:id', getStudentById);

// Create new student
router.post('/', createStudent);

// Update student
router.put('/:id', updateStudent);

// Delete student (admin only)
router.delete('/:id', requireRole(['admin']), deleteStudent);

module.exports = router;
