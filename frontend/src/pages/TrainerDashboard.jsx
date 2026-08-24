import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Dumbbell, Calendar, Clock, User, Award, CheckCircle2, XCircle,
  ToggleLeft, ToggleRight, AlertCircle, BookOpen, Star
} from 'lucide-react';

const statusColors = {
  booked:    { bg: 'rgba(99,102,241,0.15)',  color: '#a5b4fc', border: '1px solid rgba(165,180,252,0.3)' },
  attended:  { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' },
};

const membershipColors = {
  platinum: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  premium:  { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24' },
  basic:    { bg: 'rgba(148,163,184,0.1)',  color: '#94a3b8' },
};

const Badge = ({ label, style }) => (
  <span style={{
    display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', letterSpacing: '0.04em',
    ...style
  }}>{label}</span>
);

const TrainerDashboard = () => {
  const { token, member } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    setLoading(true); setError(null);
    try {
      const [profileRes, scheduleRes] = await Promise.all([
        fetch('/api/v1/trainer/profile', { headers: authHeader }),
        fetch('/api/v1/trainer/schedule', { headers: authHeader }),
      ]);
      const profileData = await profileRes.json();
      const scheduleData = await scheduleRes.json();

      if (!profileRes.ok) throw new Error(profileData.message);
      if (!scheduleRes.ok) throw new Error(scheduleData.message);

      setProfile(profileData.data);
      setSchedule(scheduleData.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [token]);

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await fetch('/api/v1/trainer/availability', { method: 'PATCH', headers: authHeader });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setProfile(result.data);
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setToggling(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const res = await fetch(`/api/v1/trainer/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setSchedule(prev => prev.map(b => b._id === bookingId ? result.data : b));
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const stats = {
    total: schedule.length,
    booked: schedule.filter(b => b.status === 'booked').length,
    attended: schedule.filter(b => b.status === 'attended').length,
    cancelled: schedule.filter(b => b.status === 'cancelled').length,
  };

  if (loading) return (
    <div className="loading-container"><div className="spinner"></div><p>Loading your dashboard...</p></div>
  );
  if (error) return (
    <div className="alert-error"><AlertCircle size={18} style={{ display: 'inline', marginRight: '8px' }} />{error}</div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(20,184,166,0.15)', color: '#5eead4', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Dumbbell size={15} /> TRAINER PORTAL
          </div>
          <h1 className="page-title">Welcome, {member?.name}</h1>
          <p className="page-subtitle">Manage your class schedule and member sessions.</p>
        </div>

        {/* Availability Toggle Card */}
        {profile && (
          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', minWidth: '240px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Your Availability Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span className={`status-badge ${profile.available ? 'available' : 'fully-booked'}`}>
                {profile.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <button
              onClick={handleToggleAvailability}
              disabled={toggling}
              style={{
                width: '100%', padding: '0.6rem',
                background: profile.available ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                border: profile.available ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(74,222,128,0.3)',
                color: profile.available ? '#f87171' : '#4ade80',
                borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {profile.available ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
              {toggling ? 'Updating...' : profile.available ? 'Go Unavailable' : 'Go Available'}
            </button>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Sessions', value: stats.total, color: 'rgba(99,102,241,0.15)', iconColor: 'var(--primary)' },
          { label: 'Upcoming (Booked)', value: stats.booked, color: 'rgba(99,102,241,0.15)', iconColor: '#a5b4fc' },
          { label: 'Attended', value: stats.attended, color: 'rgba(34,197,94,0.15)', iconColor: '#4ade80' },
          { label: 'Cancelled', value: stats.cancelled, color: 'rgba(239,68,68,0.15)', iconColor: '#f87171' },
        ].map(({ label, value, color, iconColor }) => (
          <div key={label} className="glass-card">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{label}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: iconColor }}>{value}</h3>
          </div>
        ))}
      </div>

      {/* Profile Info */}
      {profile && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={18} style={{ color: 'var(--secondary)' }} /> Trainer Profile
          </h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full Name</span><div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{profile.name}</div></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Specialization</span><div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{profile.specialization}</div></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Status</span><div style={{ marginTop: '0.35rem' }}><span className={`status-badge ${profile.available ? 'available' : 'fully-booked'}`}>{profile.available ? 'Available' : 'Unavailable'}</span></div></div>
          </div>
        </div>
      )}

      {/* Schedule */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        <BookOpen size={20} style={{ display: 'inline', marginRight: '8px', color: 'var(--primary)', verticalAlign: 'text-bottom' }} />
        My Class Schedule
      </h2>

      {schedule.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Calendar size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No sessions scheduled yet. Once members book your classes, they'll appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {schedule.map(b => (
            <div key={b._id} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{b.className}</h3>
                    <Badge label={b.status} style={statusColors[b.status]} />
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span>
                      <User size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--primary)' }} />
                      {b.memberId?.name}
                      {b.memberId?.membershipType && (
                        <Badge label={b.memberId.membershipType} style={{ marginLeft: '6px', ...membershipColors[b.memberId.membershipType] }} />
                      )}
                    </span>
                    <span><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />{b.date}</span>
                    <span><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />{b.timeSlot}</span>
                  </div>
                </div>

                {b.status === 'booked' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleStatusUpdate(b._id, 'attended')}
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '0.45rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={15} /> Mark Attended
                    </button>
                    <button onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '0.45rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <XCircle size={15} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
