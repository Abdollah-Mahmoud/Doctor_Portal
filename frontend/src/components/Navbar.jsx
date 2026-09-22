import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { doctor, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [navExpanded, setNavExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const closeNav = () => setNavExpanded(false);

  return (
    <nav className="navbar navbar-expand-lg portal-navbar sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to={isAuthenticated ? '/dashboard' : '/signin'} onClick={closeNav}>
          <span className="brand-badge">
            <i className="bi bi-heart-pulse-fill"></i>
          </span>
          <div>
            <div className="fw-bold text-primary lh-1" style={{ fontSize: '1.2rem' }}>DoctorPortal</div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Private Practice Suite</small>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setNavExpanded(!navExpanded)}
          aria-controls="navbarNav"
          aria-expanded={navExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Items */}
        <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="navbarNav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-1">
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                    onClick={closeNav}
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/patients"
                    className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                    onClick={closeNav}
                  >
                    <i className="bi bi-people me-1"></i> Patients
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/appointments"
                    className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                    onClick={closeNav}
                  >
                    <i className="bi bi-calendar-event me-1"></i> Appointments
                  </NavLink>
                </li>
              </ul>

              {/* Right User Bar */}
              <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                <Link
                  to="/profile"
                  className="text-decoration-none d-flex align-items-center gap-2 p-1 px-2 rounded-3 bg-light border"
                  onClick={closeNav}
                >
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px' }}>
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <div className="text-start d-none d-sm-block">
                    <div className="fw-semibold text-dark lh-1" style={{ fontSize: '0.85rem' }}>
                      {doctor?.name || 'Doctor'}
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.725rem' }}>
                      {doctor?.specialty || 'General Practitioner'}
                    </small>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                  title="Sign Out"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item">
                <Link to="/signin" className="btn btn-outline-primary btn-sm px-3" onClick={closeNav}>
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="btn btn-primary btn-sm px-3" onClick={closeNav}>
                  Sign Up
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
