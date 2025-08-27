import React from 'react';
import { FaUsers, FaUserCheck, FaUserClock, FaGraduationCap } from 'react-icons/fa';

const Dashboard = ({ students }) => {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const inactiveStudents = students.filter(s => s.status === 'Inactive').length;
  const averageGrade = students.length > 0 ? 
    students.reduce((acc, student) => {
      const gradeMap = { 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7, 'C+': 2.3, 'C': 2, 'C-': 1.7, 'D': 1, 'F': 0 };
      return acc + (gradeMap[student.grade] || 0);
    }, 0) / students.length : 0;

  const recentActivities = students
    .flatMap(student => 
      student.history?.map(h => ({
        ...h,
        studentName: `${student.firstName} ${student.lastName}`
      })) || []
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#667eea' }}>
            <FaUsers />
          </div>
          <div className="stat-number">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#28a745' }}>
            <FaUserCheck />
          </div>
          <div className="stat-number">{activeStudents}</div>
          <div className="stat-label">Active Students</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#ffc107' }}>
            <FaUserClock />
          </div>
          <div className="stat-number">{inactiveStudents}</div>
          <div className="stat-label">Inactive Students</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#dc3545' }}>
            <FaGraduationCap />
          </div>
          <div className="stat-number">{averageGrade.toFixed(1)}</div>
          <div className="stat-label">Average GPA</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div className="student-list">
          <div className="list-header">
            <h3>Recent Students</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {students.slice(0, 5).map(student => (
              <div key={student.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #e1e1e1'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {student.firstName} {student.lastName}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {student.course}
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem',
                  backgroundColor: student.status === 'Active' ? '#d4edda' : '#f8d7da',
                  color: student.status === 'Active' ? '#155724' : '#721c24'
                }}>
                  {student.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="student-list">
          <div className="list-header">
            <h3>Recent Activities</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {recentActivities.map((activity, index) => (
              <div key={index} style={{ 
                padding: '10px 0',
                borderBottom: '1px solid #e1e1e1'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {activity.action}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {activity.studentName} - {activity.date}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#999' }}>
                  by {activity.performedBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
