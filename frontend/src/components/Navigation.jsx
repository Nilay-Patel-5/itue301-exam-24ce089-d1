import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Dumbbell, Calendar, BookmarkCheck, Shield,
  LogOut, LogIn, LayoutDashboard, Users, Crown
} from 'lucide-react';

const NavLink = ({ to, icon, label, pathname }) => (
  <li>
    <Link to={to} className={`nav-link ${pathname === to ? 'active' : ''}`}>
      {icon}
      {label}
    </Link>
  </li>
);

const iconStyle = { display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' };

const Navigation = () => {
  const { member, token, role, logout } = useContext(AuthContext);
  const location = useLocation();
  const p = location.pathname;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo-brand">
          <div className="logo-icon"><Dumbbell size={24} /></div>
          <span>FitZone<span style={{ color: 'var(--primary)' }}>Gym</span></span>
        </Link>

        <ul className="nav-links">
          {token && (
            <>
              {/* ── MEMBER links ──────────────────────────── */}
              {role === 'member' && (
                <>
                  <NavLink to="/classes"     icon={<Calendar size={18} style={iconStyle} />}     label="Classes & Trainers" pathname={p} />
                  <NavLink to="/my-bookings" icon={<BookmarkCheck size={18} style={iconStyle} />} label="My Bookings"        pathname={p} />
                </>
              )}

              {/* ── TRAINER links ─────────────────────────── */}
              {role === 'trainer' && (
                <>
                  <NavLink to="/trainer/dashboard" icon={<LayoutDashboard size={18} style={iconStyle} />} label="My Dashboard" pathname={p} />
                </>
              )}

              {/* ── ADMIN links ───────────────────────────── */}
              {role === 'admin' && (
                <>
                  <NavLink to="/admin" icon={<Shield size={18} style={iconStyle} />} label="Admin Panel" pathname={p} />
                </>
              )}

              {/* ── User badge + Logout ───────────────────── */}
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="user-badge">
                  {role === 'admin'   && <Crown   size={14} style={{ color: '#fbbf24' }} />}
                  {role === 'trainer' && <Dumbbell size={14} style={{ color: 'var(--secondary)' }} />}
                  {role === 'member'  && <Users    size={14} style={{ color: 'var(--primary)' }} />}
                  <span style={{ fontWeight: 600 }}>{member?.name || 'User'}</span>
                  <span style={{ opacity: 0.55, fontSize: '0.75rem', textTransform: 'capitalize', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                    {role}
                  </span>
                </div>
                <button onClick={logout} className="btn-logout">
                  <LogOut size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
