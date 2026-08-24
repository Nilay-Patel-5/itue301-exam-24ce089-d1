import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookmarkCheck, Calendar, Clock, User, Award, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch your bookings');
      }

      setBookings(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [token]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/v1/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update booking status');
      }

      // Refresh list
      fetchMyBookings();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">My Class Bookings</h1>
        <p className="page-subtitle">
          Manage your reserved trainer-led sessions and status updates.
        </p>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your reservation schedule...</p>
        </div>
      )}

      {error && (
        <div className="alert-error">
          <strong>Error loading bookings:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {bookings.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <BookmarkCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3>No Active Class Bookings Found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Head over to the Classes page to reserve your first class!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {bookings.map((b) => (
                <div key={b._id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{b.className}</h3>
                        <span
                          className={`status-badge ${
                            b.status === 'booked' ? 'available' : b.status === 'attended' ? 'available' : 'fully-booked'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                        <div>
                          <User size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom', color: 'var(--primary)' }} />
                          Trainer: <strong>{b.trainerId?.name || 'Assigned Trainer'}</strong>
                        </div>
                        <div>
                          <Award size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom', color: 'var(--secondary)' }} />
                          Specialization: <strong>{b.trainerId?.specialization || 'General'}</strong>
                        </div>
                        <div>
                          <Calendar size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                          Date: <strong>{b.date}</strong>
                        </div>
                        <div>
                          <Clock size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                          Time: <strong>{b.timeSlot}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {b.status === 'booked' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'attended')}
                            style={{
                              background: 'rgba(34, 197, 94, 0.15)',
                              border: '1px solid rgba(74, 222, 128, 0.3)',
                              color: '#4ade80',
                              padding: '0.5rem 0.85rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.85rem'
                            }}
                          >
                            <CheckCircle2 size={15} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            Mark Attended
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(248, 113, 113, 0.3)',
                              color: '#f87171',
                              padding: '0.5rem 0.85rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.85rem'
                            }}
                          >
                            <XCircle size={15} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
