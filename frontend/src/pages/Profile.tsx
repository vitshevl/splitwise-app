import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || user.email.charAt(0).toUpperCase()
    : '?';

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.email?.split('@')[0] || 'User';

  return (
    <div className={styles.container}>
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
        <button onClick={logout} className={styles.logoutBtn}>
          Sign out
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <span>{initials}</span>
          </div>
          
          <div className={styles.info}>
            <h1 className={styles.name}>{displayName}</h1>
            <p className={styles.email}>{user?.email}</p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Activities</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>0 km</span>
              <span className={styles.statLabel}>Total Distance</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>--:--</span>
              <span className={styles.statLabel}>Avg Pace</span>
            </div>
          </div>
        </div>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>No activities yet</h2>
          <p>Connect your Strava account to start importing your running workouts and see detailed split analysis.</p>
          <button className={styles.connectBtn} disabled>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Connect Strava (Coming Soon)
          </button>
        </div>
      </main>
    </div>
  );
}

