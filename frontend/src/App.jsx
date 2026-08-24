import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ClassesPage from './pages/ClassesPage';
import MyBookingsPage from './pages/MyBookingsPage';
import TrainerDashboard from './pages/TrainerDashboard';

// Lazy-loaded Admin Panel (React.lazy + Suspense)
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const SuspenseFallback = (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading view...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Suspense fallback={SuspenseFallback}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<LoginPage />} />

                {/* Member-only routes */}
                <Route path="/classes" element={
                  <ProtectedRoute allowedRoles={['member']}>
                    <ClassesPage />
                  </ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                  <ProtectedRoute allowedRoles={['member']}>
                    <MyBookingsPage />
                  </ProtectedRoute>
                } />

                {/* Trainer-only routes */}
                <Route path="/trainer/dashboard" element={
                  <ProtectedRoute allowedRoles={['trainer']}>
                    <TrainerDashboard />
                  </ProtectedRoute>
                } />

                {/* Admin-only routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
