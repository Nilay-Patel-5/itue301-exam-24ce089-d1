import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TrainerCard from '../components/TrainerCard';
import { Search, Calendar, Clock, BookOpen, User, CheckCircle2, AlertCircle, Crown, Star, Award } from 'lucide-react';

const membershipBadges = {
  platinum: { label: 'Platinum Tier Member', bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', icon: <Crown size={15} /> },
  premium:  { label: 'Premium Tier Member',  bg: 'rgba(251, 191, 36, 0.15)',  color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)',  icon: <Star size={15} /> },
  basic:    { label: 'Basic Tier Member',    bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)', icon: <Award size={15} /> },
};

const ClassesPage = () => {
  // Task 4 States: trainers, loading, error
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side Search state for specialization filter
  const [searchSpecialization, setSearchSpecialization] = useState('');

  // Task 2 Booking Form States using useState (at least selectedTrainer and selectedTimeSlot)
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [className, setClassName] = useState('Morning HIIT Blast');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('07:00 AM - 08:00 AM');

  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { token, member } = useContext(AuthContext);

  // Task 4: Fetch trainers via GET /api/v1/trainers inside useEffect()
  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/v1/trainers');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch trainers list');
        }

        setTrainers(result.data || []);
        if (result.data && result.data.length > 0) {
          setSelectedTrainer(result.data[0]._id);
        }
      } catch (err) {
        setError(err.message || 'Error fetching trainers data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Task 4: Derive filtered list with .filter() at render time based on search input
  const filteredTrainers = trainers.filter((t) =>
    t.specialization.toLowerCase().includes(searchSpecialization.toLowerCase())
  );

  // Task 2 Form submission handling
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setBookingSuccess(null);
    setBookingError(null);

    if (!selectedTrainer) {
      setBookingError('Please select a trainer to book a class.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trainerId: selectedTrainer,
          className,
          date: bookingDate,
          timeSlot: selectedTimeSlot,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors ? result.errors.join(', ') : result.message || 'Failed to book class'
        );
      }

      setBookingSuccess(`Class '${className}' successfully booked!`);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Find currently selected trainer name to display state change meaningfully
  const selectedTrainerObj = trainers.find((t) => t._id === selectedTrainer);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        {member?.membershipType && membershipBadges[member.membershipType] && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
            marginBottom: '0.75rem',
            background: membershipBadges[member.membershipType].bg,
            color: membershipBadges[member.membershipType].color,
            border: membershipBadges[member.membershipType].border
          }}>
            {membershipBadges[member.membershipType].icon}
            {membershipBadges[member.membershipType].label}
          </div>
        )}
        <h1 className="page-title">Fitness Classes & Trainers</h1>
        <p className="page-subtitle">
          Explore expert trainer-led classes and reserve your session spot.
        </p>
      </div>

      {/* Task 4 Search Filter */}
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Filter trainers by specialization (e.g. CrossFit, Yoga, Pilates)..."
          value={searchSpecialization}
          onChange={(e) => setSearchSpecialization(e.target.value)}
        />
      </div>

      {/* Task 4 State Handling: Loading, Error, Data Display */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching certified trainers...</p>
        </div>
      )}

      {error && (
        <div className="alert-error">
          <AlertCircle size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          <strong>Error loading trainers:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Our Certified Trainers</h2>
            {filteredTrainers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No trainers match your filter criteria.</p>
            ) : (
              <div className="grid-cards">
                {filteredTrainers.map((trainer) => (
                  <TrainerCard
                    key={trainer._id}
                    name={trainer.name}
                    specialization={trainer.specialization}
                    available={trainer.available}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Task 2: Class Booking Form */}
          <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
              <BookOpen size={22} style={{ display: 'inline', marginRight: '8px', color: 'var(--primary)' }} />
              Reserve a Fitness Class
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Fill in class details to secure your spot with a personal trainer.
            </p>

            {bookingSuccess && (
              <div className="alert-success">
                <CheckCircle2 size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                {bookingSuccess}
              </div>
            )}

            {bookingError && <div className="alert-error">{bookingError}</div>}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <User size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  Select Trainer
                </label>
                <select
                  className="form-select"
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value)}
                  required
                >
                  {trainers.map((trainer) => (
                    <option key={trainer._id} value={trainer._id}>
                      {trainer.name} ({trainer.specialization}) - {trainer.available ? 'Available' : 'Fully Booked'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Class Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Morning HIIT Blast"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Clock size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    Time Slot
                  </label>
                  <select
                    className="form-select"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    required
                  >
                    <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                    <option value="06:30 PM - 07:30 PM">06:30 PM - 07:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Display meaningful state changes live */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem'
                }}
              >
                <div style={{ fontWeight: 600, color: '#a5b4fc', marginBottom: '0.25rem' }}>
                  Booking Summary (Live Selection State):
                </div>
                <div>Selected Trainer: <strong>{selectedTrainerObj ? selectedTrainerObj.name : 'None'}</strong></div>
                <div>Class & Time: <strong>{className}</strong> at <strong>{selectedTimeSlot}</strong></div>
              </div>

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Confirming Booking...' : 'Confirm Class Booking'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassesPage;
