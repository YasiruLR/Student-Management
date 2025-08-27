import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaUserPlus, FaChartBar, FaSignOutAlt, FaUserShield, FaUserTie } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Student Management
      </div>
      
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className={isActive('/')}>
            <FaHome />
            Dashboard
          </Link>
        </li>
        
        <li className="nav-item">
          <Link to="/students" className={isActive('/students')}>
            <FaUsers />
            Students
          </Link>
        </li>
        
        <li className="nav-item">
          <Link to="/students/add" className={isActive('/students/add')}>
            <FaUserPlus />
            Add Student
          </Link>
        </li>
        
        <li className="nav-item">
          <Link to="/reports" className={isActive('/reports')}>
            <FaChartBar />
            Reports
          </Link>
        </li>
      </ul>
      
      <div className="user-info">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {user?.role === 'admin' ? <FaUserShield /> : <FaUserTie />}
          <span style={{ marginLeft: '8px' }}>{user?.username}</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
          Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
