import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Journal from './pages/Journal';
import NewJournal from './pages/NewJournal';
import JournalDetail from './pages/JournalDetail';
import Insights from './pages/Insights';
import WeeklyReflection from './pages/WeeklyReflection';
import Settings from './pages/Settings';
import About from './pages/About';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold">Loading Vault...</div>;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/new" element={<NewJournal />} />
            <Route path="journal/:id" element={<JournalDetail />} />
            <Route path="insights" element={<Insights />} />
            <Route path="weekly-reflection" element={<WeeklyReflection />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
