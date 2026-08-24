import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  ShieldCheck, Users, CalendarCheck, Award, ToggleLeft, ToggleRight,
  BookmarkX, BookmarkCheck, Crown, UserCheck, AlertCircle, RefreshCw
} from 'lucide-react';

const TABS = ['Dashboard', 'All Members', 'All Bookings', 'Manage Trainers'];

const membershipColors = {
  platinum: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' },
  premium:  { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
  basic:    { bg: 'rgba(148,163,184,0.1)',  color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' },
};

const statusColors = {
  booked:    { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(165,180,252,0.3)' },
  attended:  { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' },
};

const Badge = ({ label, style }) => (
  <span style={{
    display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', letterSpacing: '0.04em',
    ...style
  }}>{label}</span>
);

const AdminPanel = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchMembers = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/v1/admin/members', { headers: authHeader });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setMembers(result.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fetchBookings = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/v1/admin/bookings', { headers: authHeader });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setBookings(result.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fetchTrainers = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/v1/trainers');
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setTrainers(result.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'All Members') fetchMembers();
    else if (activeTab === 'All Bookings') fetchBookings();
    else if (activeTab === 'Manage Trainers') fetchTrainers();
    else {
      fetchMembers();
      fetchBookings();
      fetchTrainers();
    }
  }, [activeTab]);

  const handleToggleAvailability = async (trainerId) => {
    try {
      const res = await fetch(`/api/v1/admin/trainers/${trainerId}/availability`, {
        method: 'PATCH', headers: authHeader
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setTrainers(prev => prev.map(t => t._id === trainerId ? result.data : t));
    } catch (e) { alert(`Error: ${e.message}`); }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      const res = await fetch(`/api/v1/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setBookings(prev => prev.map(b => b._id === bookingId ? result.data : b));
    } catch (e) { alert(`Error: ${e.message}`); }
  };

  const stats = {
    members: members.length,
    trainers: trainers.length,
    bookings: bookings.length,
    active: bookings.filter(b => b.status === 'booked').length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <ShieldCheck size={15} /> ADMIN CONTROL PANEL
        </div>
        <h1 className="page-title">System Management Dashboard</h1>
        <p className="page-subtitle">Full administrative control over members, bookings, and trainer rosters.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.65rem 1.25rem',
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <div className="alert-error"><AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />{error}</div>}
      {loading && <div className="loading-container"><div className="spinner"></div><p>Loading data...</p></div>}

      {/* ── Dashboard Tab ── */}
      {!loading && activeTab === 'Dashboard' && (
        <div>
          <div className="grid-cards" style={{ marginBottom: '2rem' }}>
            {[
              { label: 'Total Members', value: stats.members, icon: <Users size={26} />, color: 'rgba(99,102,241,0.15)', iconColor: 'var(--primary)' },
              { label: 'Certified Trainers', value: stats.trainers, icon: <Award size={26} />, color: 'rgba(20,184,166,0.15)', iconColor: 'var(--secondary)' },
              { label: 'Total Bookings', value: stats.bookings, icon: <CalendarCheck size={26} />, color: 'rgba(251,191,36,0.15)', iconColor: '#fbbf24' },
              { label: 'Active (Booked)', value: stats.active, icon: <BookmarkCheck size={26} />, color: 'rgba(34,197,94,0.15)', iconColor: '#4ade80' },
            ].map(({ label, value, icon, color, iconColor }) => (
              <div key={label} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{label}</p>
                    <h3 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{value}</h3>
                  </div>
                  <div style={{ background: color, padding: '0.85rem', borderRadius: '12px', color: iconColor }}>{icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#a5b4fc' }}>Recent Bookings (Latest 5)</h3>
            {bookings.slice(0, 5).map(b => (
              <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--card-border)' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{b.className}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>— {b.memberId?.name || 'Unknown'}</span>
                </div>
                <Badge label={b.status} style={statusColors[b.status]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── All Members Tab ── */}
      {!loading && activeTab === 'All Members' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {members.map((m, i) => (
            <div key={m._id} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {m.name}
                    {m.role === 'admin' && <Crown size={14} style={{ color: '#fbbf24' }} />}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {m.membershipType && (
                  <Badge label={m.membershipType} style={membershipColors[m.membershipType] || membershipColors.basic} />
                )}
                <Badge label={m.role} style={{ background: m.role === 'admin' ? 'rgba(251,191,36,0.15)' : m.role === 'trainer' ? 'rgba(20,184,166,0.15)' : 'rgba(99,102,241,0.1)', color: m.role === 'admin' ? '#fbbf24' : m.role === 'trainer' ? '#5eead4' : '#a5b4fc', border: '1px solid transparent' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── All Bookings Tab ── */}
      {!loading && activeTab === 'All Bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(b => (
            <div key={b._id} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{b.className}</h3>
                    <Badge label={b.status} style={statusColors[b.status]} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span>
                      <UserCheck size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--primary)' }} />
                      {b.memberId?.name}
                      {b.memberId?.membershipType && (
                        <Badge label={b.memberId.membershipType} style={{ marginLeft: '6px', ...(membershipColors[b.memberId.membershipType] || membershipColors.basic) }} />
                      )}
                    </span>
                    <span><Award size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--secondary)' }} />{b.trainerId?.name}</span>
                    <span>📅 {b.date} @ {b.timeSlot}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {b.status !== 'attended' && (
                    <button onClick={() => handleBookingStatusUpdate(b._id, 'attended')}
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      <BookmarkCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />Attended
                    </button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button onClick={() => handleBookingStatusUpdate(b._id, 'cancelled')}
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      <BookmarkX size={14} style={{ display: 'inline', marginRight: '4px' }} />Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Manage Trainers Tab ── */}
      {!loading && activeTab === 'Manage Trainers' && (
        <div className="grid-cards">
          {trainers.map(t => (
            <div key={t._id} className="glass-card">
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.name}</h3>
                  <span className={`status-badge ${t.available ? 'available' : 'fully-booked'}`}>
                    {t.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.specialization}</p>
              </div>
              <button
                onClick={() => handleToggleAvailability(t._id)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: t.available ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                  border: t.available ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(74,222,128,0.3)',
                  color: t.available ? '#f87171' : '#4ade80',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {t.available ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
                {t.available ? 'Mark as Unavailable' : 'Mark as Available'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
