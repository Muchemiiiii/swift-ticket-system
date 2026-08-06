import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { UserDashboard } from './pages/EndUser/Dashboard';
import { CreateTicket } from './pages/EndUser/CreateTicket';
import { Reports } from './pages/Manager/Reports';
import { ArticleList } from './pages/KnowledgeBase/ArticleList';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<UserDashboard />} />
                <Route path="/create" element={<CreateTicket />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/resolution" element={<ArticleList />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
