import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPrint, FaPlus, FaSearch } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const StudentList = ({ students, onDelete, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Student List Report'
  });

  const filteredStudents = students
    .filter(student => 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy]?.toString().toLowerCase() || '';
      const bValue = b[sortBy]?.toString().toLowerCase() || '';
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div className="student-list">
        <div className="list-header">
          <h2>Student Management</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <FaPrint /> Print List
            </button>
            <Link to="/students/add" className="btn btn-success">
              <FaPlus /> Add Student
            </Link>
          </div>
        </div>

        <div className="search-container">
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#666'
            }} />
            <input
              type="text"
              placeholder="Search students by name, email, course, or status..."
              className="search-input"
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        <div ref={printRef}>
          <div style={{ display: 'none' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
              Student List Report
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
              Generated on: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>
                  Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('course')} style={{ cursor: 'pointer' }}>
                  Course {sortBy === 'course' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('grade')} style={{ cursor: 'pointer' }}>
                  Grade {sortBy === 'grade' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('enrollmentDate')} style={{ cursor: 'pointer' }}>
                  Enrollment Date {sortBy === 'enrollmentDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>
                      {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {student.phone}
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      backgroundColor: student.grade?.startsWith('A') ? '#d4edda' : 
                                     student.grade?.startsWith('B') ? '#fff3cd' : '#f8d7da',
                      color: student.grade?.startsWith('A') ? '#155724' : 
                             student.grade?.startsWith('B') ? '#856404' : '#721c24'
                    }}>
                      {student.grade}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      backgroundColor: student.status === 'Active' ? '#d4edda' : '#f8d7da',
                      color: student.status === 'Active' ? '#155724' : '#721c24'
                    }}>
                      {student.status}
                    </span>
                  </td>
                  <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                  <td className="no-print">
                    <div className="action-buttons">
                      <Link 
                        to={`/students/history/${student.id}`} 
                        className="btn btn-secondary"
                        title="View History"
                      >
                        <FaEye />
                      </Link>
                      <Link 
                        to={`/students/edit/${student.id}`} 
                        className="btn btn-warning"
                        title="Edit Student"
                      >
                        <FaEdit />
                      </Link>
                      {userRole === 'admin' && (
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                          title="Delete Student"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666' 
          }}>
            {searchTerm ? 'No students found matching your search.' : 'No students found.'}
          </div>
        )}
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentList;
