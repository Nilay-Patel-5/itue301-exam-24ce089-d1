import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dumbbell, Calendar, BookmarkCheck, Shield, LogOut, LogIn } from 'lucide-react';

const Navigation = () => {
  const { member, token, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo-brand">
          <div className="logo-icon">
            <Dumbbell size={24} />
          </div>
          <span>FitZone<span style={{ color: 'var(--primary)' }}>Gym</span></span>
        </Link>

        <ul className="nav-links">
          {token ? (
            <>
              <li>
                <Link
                  to="/classes"
                  className={`nav-link ${location.pathname === '/classes' ? 'active' : ''}`}
                >
                  <Calendar size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  Classes & Trainers
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}
                >
                  <BookmarkCheck size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  <Shield size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  Admin Panel
                </Link>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="user-badge">
                  <span style={{ fontWeight: 600 }}>{member?.name || 'Member'}</span>
                  <span style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'capitalize' }}>
                    ({member?.membershipType || 'basic'})
                  </span>
                </div>
                <button onClick={logout} className="btn-logout" title="Logout">
                  <LogOut size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <LogIn size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                Member Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
