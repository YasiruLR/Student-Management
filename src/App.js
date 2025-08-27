import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import StudentList from './components/Students/StudentList';
import AddStudent from './components/Students/AddStudent';
import EditStudent from './components/Students/EditStudent';
import StudentHistory from './components/Students/StudentHistory';
import Reports from './components/Reports/Reports';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load students from localStorage (in a real app, this would be from an API)
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Initialize with some sample data
      const sampleStudents = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '123-456-7890',
          dateOfBirth: '2000-01-15',
          address: '123 Main St, City, State',
          enrollmentDate: '2023-09-01',
          status: 'Active',
          grade: 'A',
          course: 'Computer Science',
          history: [
            { date: '2023-09-01', action: 'Enrolled', performedBy: 'admin' },
            { date: '2023-12-15', action: 'Grade Updated to A', performedBy: 'admin' }
          ]
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          phone: '098-765-4321',
          dateOfBirth: '1999-05-20',
          address: '456 Oak Ave, City, State',
          enrollmentDate: '2023-08-15',
          status: 'Active',
          grade: 'B+',
          course: 'Business Administration',
          history: [
            { date: '2023-08-15', action: 'Enrolled', performedBy: 'employee' },
            { date: '2023-11-20', action: 'Grade Updated to B+', performedBy: 'admin' }
          ]
        }
      ];
      setStudents(sampleStudents);
      localStorage.setItem('students', JSON.stringify(sampleStudents));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now(),
      enrollmentDate: new Date().toISOString().split('T')[0],
      history: [
        { 
          date: new Date().toISOString().split('T')[0], 
          action: 'Enrolled', 
          performedBy: user?.username || 'system' 
        }
      ]
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const updateStudent = (id, updatedStudent) => {
    const updatedStudents = students.map(student => {
      if (student.id === id) {
        const updated = { ...student, ...updatedStudent };
        updated.history = [
          ...student.history,
          { 
            date: new Date().toISOString().split('T')[0], 
            action: 'Information Updated', 
            performedBy: user?.username || 'system' 
          }
        ];
        return updated;
      }
      return student;
    });
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const deleteStudent = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={logout} />}
        <div className={user ? "main-content" : ""}>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={login} /> : <Dashboard students={students} />} 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute user={user}>
                  <Dashboard students={students} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute user={user}>
                  <StudentList 
                    students={students} 
                    onDelete={deleteStudent}
                    userRole={user?.role}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/add" 
              element={
                <ProtectedRoute user={user}>
                  <AddStudent onAdd={addStudent} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/edit/:id" 
              element={
                <ProtectedRoute user={user}>
                  <EditStudent 
                    students={students} 
                    onUpdate={updateStudent} 
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/history/:id" 
              element={
                <ProtectedRoute user={user}>
                  <StudentHistory students={students} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute user={user}>
                  <Reports students={students} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
