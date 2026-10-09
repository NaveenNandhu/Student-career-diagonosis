import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AcademicPage } from './pages/AcademicPage';
import { MisconceptionPage } from './pages/MisconceptionPage';
import { CareerPage } from './pages/CareerPage';
import { JobShieldPage } from './pages/JobShieldPage';
import { JourneyPage } from './pages/JourneyPage';
import { FacultyPage } from './pages/FacultyPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
          />

          <Route
            path="/academic"
            element={
              <AppLayout>
                <AcademicPage />
              </AppLayout>
            }
          />

          <Route
            path="/misconceptions"
            element={
              <AppLayout>
                <MisconceptionPage />
              </AppLayout>
            }
          />

          <Route
            path="/career"
            element={
              <AppLayout>
                <CareerPage />
              </AppLayout>
            }
          />

          <Route
            path="/jobshield"
            element={
              <AppLayout>
                <JobShieldPage />
              </AppLayout>
            }
          />

          <Route
            path="/journey"
            element={
              <AppLayout>
                <JourneyPage />
              </AppLayout>
            }
          />

          <Route
            path="/faculty"
            element={
              <AppLayout>
                <FacultyPage />
              </AppLayout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
