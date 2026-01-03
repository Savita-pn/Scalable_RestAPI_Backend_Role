import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>Task Manager</h1>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/tasks/new">New Task</Link>
            <span>Welcome, {user.name} ({user.role})</span>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;