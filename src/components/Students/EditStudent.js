import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

const EditStudent = ({ students, onUpdate }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    course: '',
    grade: 'A',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const courses = [
    'Computer Science',
    'Business Administration',
    'Engineering',
    'Medicine',
    'Law',
    'Psychology',
    'Economics',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

  useEffect(() => {
    const student = students.find(s => s.id === parseInt(id));
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        address: student.address,
        course: student.course,
        grade: student.grade,
        status: student.status
      });
    } else {
      navigate('/students');
    }
    setLoading(false);
  }, [id, students, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.course) {
      newErrors.course = 'Course is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(parseInt(id), formData);
      navigate('/students');
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '1.2rem'
      }}>
        Loading student data...
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Student</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              className={`form-input ${errors.firstName ? 'error' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.firstName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              className={`form-input ${errors.lastName ? 'error' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.phone}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.dateOfBirth}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Course *</label>
            <select
              name="course"
              className={`form-input ${errors.course ? 'error' : ''}`}
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            {errors.course && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.course}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address *</label>
          <textarea
            name="address"
            className={`form-input ${errors.address ? 'error' : ''}`}
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address"
            rows="3"
            style={{ resize: 'vertical' }}
          />
          {errors.address && (
            <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '5px' }}>
              {errors.address}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Grade</label>
            <select
              name="grade"
              className="form-input"
              value={formData.grade}
              onChange={handleChange}
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            <FaSave /> Update Student
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            <FaTimes /> Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-input.error {
          border-color: #dc3545;
        }
        .form-input.error:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
      `}</style>
    </div>
  );
};

export default EditStudent;
