import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || user.email.charAt(0).toUpperCase()
    : '?';

  return (
    <div className={styles.layout}>
      <div className={styles.background}>
        <div className={styles.gridOverlay} />
        <div className={styles.glowOrb} />
      </div>

      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className={styles.brandName}>Splitwise</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </NavLink>
          <NavLink
            to="/activities"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Activities
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Journal
          </NavLink>
          <NavLink
            to="/training"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Training
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
            Analytics
          </NavLink>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.avatar}>
            <span>{initials}</span>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

