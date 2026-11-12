import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GrievanceProvider } from './context/GrievanceContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SubmitGrievance from './pages/SubmitGrievance';
import TrackGrievance from './pages/TrackGrievance';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

export default function App() {
  return (
    <GrievanceProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Screen 1: Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Screen 2: Submit Form with fake AI analysis */}
              <Route path="/submit" element={<SubmitGrievance />} />

              {/* Screen 3: Track status by ticket ID with stepper */}
              <Route path="/track" element={<TrackGrievance />} />

              {/* Screen 4: Admin dashboard with KPI cards, 3 Recharts, and filterable table */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Catch-all redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </GrievanceProvider>
  );
}
