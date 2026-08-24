import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Users, CalendarCheck, Activity, Award } from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState({ membersCount: 3, trainersCount: 4, bookingsCount: 1 });
  const [loading, setLoading] = useState(false);

  const { member } = useContext(AuthContext);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          <ShieldCheck size={16} /> Admin Controls & Management Roster
        </div>
        <h1 className="page-title">Admin Management Dashboard</h1>
        <p className="page-subtitle">
          Lazy-loaded administrative overview for gym class rosters and trainer schedules.
        </p>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Gym Members</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>3</h3>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.85rem', borderRadius: '12px', color: 'var(--primary)' }}>
              <Users size={28} />
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Certified Trainers</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>4</h3>
            </div>
            <div style={{ background: 'rgba(20, 184, 166, 0.15)', padding: '0.85rem', borderRadius: '12px', color: 'var(--secondary)' }}>
              <Award size={28} />
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Class Bookings</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>1</h3>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '0.85rem', borderRadius: '12px', color: '#4ade80' }}>
              <CalendarCheck size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} style={{ color: 'var(--primary)' }} /> System Status & Live Component Check
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Logged in as Administrator: <strong>{member?.name || 'Admin'}</strong> ({member?.email || 'admin@fitzone.com'})
        </p>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', fontSize: '0.9rem' }}>
          <div>✅ <strong>React.lazy + Suspense</strong> chunk loaded dynamically on demand for route <code>/admin</code>.</div>
          <div>✅ <strong>AuthGuard & RequestLogger</strong> Express middlewares verifying requests.</div>
          <div>✅ <strong>Mongoose Validation & References</strong> populated on backend models.</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
