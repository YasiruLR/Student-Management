import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPrint, FaUser, FaEnvelope, FaPhone, FaMapMarker, FaGraduationCap, FaCalendar } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const StudentHistory = ({ students }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const student = students.find(s => s.id === parseInt(id));

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${student?.firstName} ${student?.lastName} - History Report`
  });

  if (!student) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
      }}>
        <h2>Student Not Found</h2>
        <p>The student you're looking for doesn't exist.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/students')}
          style={{ marginTop: '20px' }}
        >
          Back to Students
        </button>
      </div>
    );
  }

  const sortedHistory = [...(student.history || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="history-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e1e1e1'
        }}>
          <h2 style={{ margin: 0 }}>Student History</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <FaPrint /> Print History
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/students')}>
              <FaArrowLeft /> Back to Students
            </button>
          </div>
        </div>

        <div ref={printRef}>
          <div style={{ display: 'none' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
              Student History Report
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
              Generated on: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Student Information Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center' }}>
                  <FaUser style={{ marginRight: '10px' }} />
                  {student.firstName} {student.lastName}
                </h3>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <FaEnvelope style={{ marginRight: '10px', minWidth: '16px' }} />
                  {student.email}
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <FaPhone style={{ marginRight: '10px', minWidth: '16px' }} />
                  {student.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaMapMarker style={{ marginRight: '10px', minWidth: '16px', marginTop: '2px' }} />
                  {student.address}
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  <FaGraduationCap style={{ marginRight: '10px', minWidth: '16px' }} />
                  <div>
                    <strong>Course:</strong> {student.course}
                  </div>
                </div>
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  <FaCalendar style={{ marginRight: '10px', minWidth: '16px' }} />
                  <div>
                    <strong>Enrollment Date:</strong> {new Date(student.enrollmentDate).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Grade:</strong> 
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '0.9rem'
                  }}>
                    {student.grade}
                  </span>
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: student.status === 'Active' ? '#28a745' : '#dc3545',
                    fontSize: '0.9rem'
                  }}>
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Activity Timeline</h3>
            
            {sortedHistory.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                No history records found for this student.
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '10px',
                  bottom: '10px',
                  width: '2px',
                  background: '#667eea'
                }}></div>

                {sortedHistory.map((record, index) => (
                  <div key={index} className="history-item" style={{ 
                    position: 'relative',
                    marginLeft: '50px',
                    marginBottom: '20px'
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-35px',
                      top: '15px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#667eea',
                      border: '3px solid white',
                      boxShadow: '0 0 0 2px #667eea'
                    }}></div>

                    <div className="history-date">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="history-action" style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                      {record.action}
                    </div>
                    <div className="history-user">
                      Performed by: {record.performedBy}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Statistics */}
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #667eea'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <strong>Total Activities:</strong> {sortedHistory.length}
              </div>
              <div>
                <strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}
              </div>
              <div>
                <strong>Age:</strong> {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} years
              </div>
              <div>
                <strong>Time as Student:</strong> {Math.floor((new Date() - new Date(student.enrollmentDate)) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHistory;
