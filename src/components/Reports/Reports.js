import React, { useState, useRef } from 'react';
import { FaPrint, FaDownload, FaChartBar, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const Reports = ({ students }) => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Students Report - ${new Date().toLocaleDateString()}`
  });

  const courses = [...new Set(students.map(s => s.course))];
  
  const filterStudents = () => {
    let filtered = [...students];
    
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(s => s.course === selectedCourse);
    }
    
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRange) {
        case '30days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          return filtered;
      }
      
      filtered = filtered.filter(s => new Date(s.enrollmentDate) >= cutoffDate);
    }
    
    return filtered;
  };

  const filteredStudents = filterStudents();

  const getOverviewStats = () => {
    const total = filteredStudents.length;
    const active = filteredStudents.filter(s => s.status === 'Active').length;
    const inactive = filteredStudents.filter(s => s.status === 'Inactive').length;
    
    const gradeDistribution = {};
    filteredStudents.forEach(student => {
      gradeDistribution[student.grade] = (gradeDistribution[student.grade] || 0) + 1;
    });
    
    const courseDistribution = {};
    filteredStudents.forEach(student => {
      courseDistribution[student.course] = (courseDistribution[student.course] || 0) + 1;
    });
    
    return {
      total,
      active,
      inactive,
      gradeDistribution,
      courseDistribution
    };
  };

  const stats = getOverviewStats();

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Course', 'Grade', 'Status', 'Enrollment Date'];
    const csvData = filteredStudents.map(student => [
      `${student.firstName} ${student.lastName}`,
      student.email,
      student.course,
      student.grade,
      student.status,
      student.enrollmentDate
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e1e1e1'
      }}>
        <h2 style={{ margin: 0 }}>Reports & Analytics</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <FaDownload /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <FaPrint /> Print Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div className="form-group">
          <label className="form-label">Report Type</label>
          <select 
            className="form-input"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed List</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date Range</label>
          <select 
            className="form-input"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Course Filter</label>
          <select 
            className="form-input"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      <div ref={printRef}>
        <div style={{ display: 'none' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
            Student Management Report
          </h1>
          <p style={{ textAlign: 'center', marginBottom: '30px' }}>
            Generated on: {new Date().toLocaleDateString()}<br />
            Report Type: {reportType.charAt(0).toUpperCase() + reportType.slice(1)}<br />
            Filters: {dateRange !== 'all' ? dateRange : 'All Time'}, {selectedCourse !== 'all' ? selectedCourse : 'All Courses'}
          </p>
        </div>

        {reportType === 'overview' && (
          <div>
            {/* Overview Statistics */}
            <div className="report-section">
              <h3 className="report-title">
                <FaChartBar style={{ marginRight: '10px' }} />
                Overview Statistics
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ color: '#667eea' }}>
                    <FaUsers />
                  </div>
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total Students</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ color: '#28a745' }}>
                    <FaUsers />
                  </div>
                  <div className="stat-number">{stats.active}</div>
                  <div className="stat-label">Active Students</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ color: '#ffc107' }}>
                    <FaUsers />
                  </div>
                  <div className="stat-number">{stats.inactive}</div>
                  <div className="stat-label">Inactive Students</div>
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="report-section">
              <h3 className="report-title">
                <FaGraduationCap style={{ marginRight: '10px' }} />
                Grade Distribution
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                  <div key={grade} style={{ 
                    textAlign: 'center',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '2px solid #e1e1e1'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                      {count}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                      Grade {grade}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Distribution */}
            <div className="report-section">
              <h3 className="report-title">Course Enrollment</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {Object.entries(stats.courseDistribution).map(([course, count]) => (
                  <div key={course} style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e1e1e1'
                  }}>
                    <span style={{ fontWeight: '500' }}>{course}</span>
                    <span style={{ 
                      padding: '4px 12px',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      {count} student{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportType === 'detailed' && (
          <div className="report-section">
            <h3 className="report-title">Detailed Student List</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.grade}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'analytics' && (
          <div>
            <div className="report-section">
              <h3 className="report-title">Analytics Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <h4>Enrollment Trends</h4>
                  <p>
                    <strong>Average students per month:</strong> {
                      Math.round(filteredStudents.length / Math.max(1, 
                        Math.ceil((new Date() - new Date(Math.min(...filteredStudents.map(s => new Date(s.enrollmentDate))))) / (1000 * 60 * 60 * 24 * 30))
                      ))
                    }
                  </p>
                  <p>
                    <strong>Most popular course:</strong> {
                      Object.entries(stats.courseDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
                    }
                  </p>
                </div>
                
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <h4>Performance Metrics</h4>
                  <p>
                    <strong>Students with A grades:</strong> {
                      filteredStudents.filter(s => s.grade.startsWith('A')).length
                    } ({Math.round((filteredStudents.filter(s => s.grade.startsWith('A')).length / filteredStudents.length) * 100)}%)
                  </p>
                  <p>
                    <strong>Active student rate:</strong> {Math.round((stats.active / stats.total) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        background: '#e7f3ff',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#0066cc'
      }}>
        <strong>Note:</strong> This report was generated on {new Date().toLocaleString()} and includes {filteredStudents.length} students based on the selected filters.
      </div>
    </div>
  );
};

export default Reports;
