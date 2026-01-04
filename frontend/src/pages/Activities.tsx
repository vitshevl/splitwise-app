import { useEffect, useState } from 'react';
import { activitiesApi } from '../services/api';
import type { Activity, ActivityStats } from '../types/activity';
import styles from './Activities.module.css';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [activitiesRes, statsRes] = await Promise.all([
        activitiesApi.getActivities(page, 10),
        activitiesApi.getStats(),
      ]);
      setActivities(activitiesRes.content);
      setTotalPages(activitiesRes.totalPages);
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Activities</h1>
        <p>Your running workouts from Strava</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.totalActivities ?? 0}</span>
          <span className={styles.statLabel}>Total Runs</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.totalDistance ?? '0 km'}</span>
          <span className={styles.statLabel}>Distance</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.totalDuration ?? '0h 0m'}</span>
          <span className={styles.statLabel}>Time</span>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading activities...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2>No activities yet</h2>
          <p>Connect your Strava account to import your running workouts and see detailed split analysis.</p>
        </div>
      ) : (
        <>
          <div className={styles.activitiesList}>
            {activities.map((activity) => (
              <div key={activity.id} className={styles.activityCard}>
                <div className={styles.activityHeader}>
                  <div className={styles.activityIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div className={styles.activityInfo}>
                    <h3>{activity.name}</h3>
                    <span className={styles.activityDate}>
                      {formatDate(activity.startDate)} at {formatTime(activity.startDate)}
                    </span>
                  </div>
                  <span className={styles.activityType}>{activity.type}</span>
                </div>
                <div className={styles.activityStats}>
                  <div className={styles.activityStat}>
                    <span className={styles.activityStatValue}>{activity.formattedDistance}</span>
                    <span className={styles.activityStatLabel}>Distance</span>
                  </div>
                  <div className={styles.activityStat}>
                    <span className={styles.activityStatValue}>{activity.formattedDuration}</span>
                    <span className={styles.activityStatLabel}>Duration</span>
                  </div>
                  <div className={styles.activityStat}>
                    <span className={styles.activityStatValue}>{activity.formattedPace}</span>
                    <span className={styles.activityStatLabel}>Pace</span>
                  </div>
                  {activity.averageHeartrate && (
                    <div className={styles.activityStat}>
                      <span className={styles.activityStatValue}>{Math.round(activity.averageHeartrate)} bpm</span>
                      <span className={styles.activityStatLabel}>Avg HR</span>
                    </div>
                  )}
                  {activity.totalElevationGain && (
                    <div className={styles.activityStat}>
                      <span className={styles.activityStatValue}>{Math.round(activity.totalElevationGain)} m</span>
                      <span className={styles.activityStatLabel}>Elevation</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className={styles.pageBtn}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

