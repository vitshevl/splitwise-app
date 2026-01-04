import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || user.email.charAt(0).toUpperCase()
    : '?';

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.email?.split('@')[0] || 'User';

  return (
    <div className={styles.container}>
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

      <div className={styles.section}>
        <h2>Strava Connection</h2>
        <div className={styles.stravaCard}>
          <div className={styles.stravaIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
          </div>
          <div className={styles.stravaInfo}>
            <h3>Connect Strava</h3>
            <p>Link your Strava account to automatically import your running activities.</p>
          </div>
          <button className={styles.stravaBtn} disabled>
            Coming Soon
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Settings</h2>
        <div className={styles.settingsCard}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Units</span>
              <span className={styles.settingValue}>Metric (km, kg)</span>
            </div>
          </div>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Timezone</span>
              <span className={styles.settingValue}>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
