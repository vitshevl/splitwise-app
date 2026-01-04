import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Activities from './pages/Activities';
import Journal from './pages/Journal';
import Training from './pages/Training';
import Analytics from './pages/Analytics';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
      
      {/* Protected routes with Layout */}
      <Route
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Profile />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/training" element={<Training />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
