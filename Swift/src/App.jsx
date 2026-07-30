import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { UserDashboard } from './pages/EndUser/Dashboard';
import { CreateTicket } from './pages/EndUser/CreateTicket';
import { TicketQueue } from './pages/ITSupport/TicketQueue';
import { Reports } from './pages/Manager/Reports';
import { ArticleList } from './pages/KnowledgeBase/ArticleList';

// ─── Route guard ─────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" replace /> : children;
};

// ─── App shell (only rendered when logged in) ────────────────────────────────
const AppShell = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {currentUser?.role === 'user' && (
            <>
              <Route path="/" element={<UserDashboard />} />
              <Route path="/create" element={<CreateTicket />} />
            </>
          )}
          {currentUser?.role === 'support' && (
            <Route path="/" element={<TicketQueue />} />
          )}
          {currentUser?.role === 'manager' && (
            <Route path="/" element={<Reports />} />
          )}

          {/* Shared */}
          <Route path="/kb" element={<ArticleList />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      }
    />
    <Route
      path="/*"
      element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }
    />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
