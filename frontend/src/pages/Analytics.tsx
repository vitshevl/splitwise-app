import { useEffect, useState } from 'react';
import { activitiesApi, journalApi, trainingApi } from '../services/api';
import type { ActivityStats } from '../types/activity';
import type { DailyLog } from '../types/journal';
import type { TrainingTask } from '../types/training';
import styles from './Analytics.module.css';

type AnalyticsTab = 'dashboard' | 'running' | 'weight' | 'walk' | 'hiking' | 'bike' | 'yoga' | 'crossfit';

interface TabConfig {
  id: AnalyticsTab;
  label: string;
  icon: JSX.Element;
}

const tabs: TabConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'running',
    label: 'Running',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
      </svg>
    ),
  },
  {
    id: 'weight',
    label: 'Weight',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 18L18 6M6 6l12 12" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
      </svg>
    ),
  },
  {
    id: 'walk',
    label: 'Walk',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
      </svg>
    ),
  },
  {
    id: 'hiking',
    label: 'Hiking',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M5 8V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3" />
        <path d="m3 15 3-3 3 3" />
        <path d="m3 18 3-3 3 3" />
      </svg>
    ),
  },
  {
    id: 'bike',
    label: 'Cycling',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
      </svg>
    ),
  },
  {
    id: 'yoga',
    label: 'Yoga',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v5" />
        <path d="M8 22l4-10 4 10" />
        <path d="M6 12l6 3 6-3" />
      </svg>
    ),
  },
  {
    id: 'crossfit',
    label: 'CrossFit',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6.5 6.5L17.5 17.5" />
        <path d="M17.5 6.5L6.5 17.5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('dashboard');
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
  const [trainingTasks, setTrainingTasks] = useState<TrainingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stats, logs, tasks] = await Promise.all([
        activitiesApi.getStats(),
        journalApi.getDailyLogs(0, 30),
        trainingApi.getTasks(0, 100),
      ]);
      setActivityStats(stats);
      setRecentLogs(logs.content);
      setTrainingTasks(tasks.content);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate weight trend
  const logsWithWeight = recentLogs.filter(l => l.morningWeight).reverse();
  const weightTrend = logsWithWeight.length >= 2
    ? (logsWithWeight[logsWithWeight.length - 1].morningWeight! - logsWithWeight[0].morningWeight!).toFixed(1)
    : null;

  // Calculate training completion rate
  const completedTasks = trainingTasks.filter(t => t.isCompleted).length;
  const completionRate = trainingTasks.length > 0
    ? Math.round((completedTasks / trainingTasks.length) * 100)
    : 0;

  // Get this week's logs
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekLogs = recentLogs.filter(l => new Date(l.logDate) >= weekAgo);

  // Average sleep
  const logsWithSleep = thisWeekLogs.filter(l => l.sleepHours);
  const avgSleep = logsWithSleep.length > 0
    ? (logsWithSleep.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / logsWithSleep.length).toFixed(1)
    : null;

  // Journal streak
  const sortedLogs = [...recentLogs].sort((a, b) => 
    new Date(b.logDate).getTime() - new Date(a.logDate).getTime()
  );
  let streak = 0;
  const checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  for (const log of sortedLogs) {
    const logDate = new Date(log.logDate + 'T00:00:00');
    if (logDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (logDate.getTime() < checkDate.getTime()) {
      break;
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading analytics...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'running':
        return renderActivityStats('Run', 'Running');
      case 'weight':
        return renderWeightAnalytics();
      case 'walk':
        return renderActivityStats('Walk', 'Walking');
      case 'hiking':
        return renderActivityStats('Hike', 'Hiking');
      case 'bike':
        return renderActivityStats('Ride', 'Cycling');
      case 'yoga':
        return renderActivityStats('Yoga', 'Yoga');
      case 'crossfit':
        return renderActivityStats('Crossfit', 'CrossFit');
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className={styles.contentSection}>
      <div className={styles.contentHeader}>
        <h2>Overview</h2>
        <p>Your overall performance summary</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{activityStats?.totalActivities ?? 0}</span>
            <span className={styles.statLabel}>Total Activities</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{activityStats?.totalDuration ?? '0h 0m'}</span>
            <span className={styles.statLabel}>Total Time</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{activityStats?.totalDistance ?? '0 km'}</span>
            <span className={styles.statLabel}>Total Distance</span>
          </div>
        </div>
      </div>

      <div className={styles.insightsGrid}>
        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <span className={styles.insightTitle}>Current Streak</span>
            <div className={`${styles.insightBadge} ${streak > 0 ? styles.positive : ''}`}>
              {streak > 0 ? '🔥' : '—'}
            </div>
          </div>
          <span className={styles.insightValue}>{streak}</span>
          <span className={styles.insightUnit}>days</span>
        </div>
        
        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <span className={styles.insightTitle}>Avg Sleep (7d)</span>
          </div>
          <span className={styles.insightValue}>{avgSleep ?? '—'}</span>
          <span className={styles.insightUnit}>hours</span>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <span className={styles.insightTitle}>Weight Trend</span>
            {weightTrend && (
              <div className={`${styles.insightBadge} ${Number(weightTrend) < 0 ? styles.positive : styles.negative}`}>
                {Number(weightTrend) < 0 ? '↓' : '↑'}
              </div>
            )}
          </div>
          <span className={styles.insightValue}>
            {weightTrend ? `${Number(weightTrend) > 0 ? '+' : ''}${weightTrend}` : '—'}
          </span>
          <span className={styles.insightUnit}>kg</span>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <span className={styles.insightTitle}>Training Rate</span>
          </div>
          <span className={styles.insightValue}>{completionRate}</span>
          <span className={styles.insightUnit}>% completed</span>
        </div>
      </div>

      <div className={styles.progressSection}>
        <h3>Training Progress</h3>
        <div className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <span>Task Completion Rate</span>
            <span className={styles.progressPercent}>{completionRate}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className={styles.progressDetails}>
            <span>{completedTasks} completed</span>
            <span>{trainingTasks.length - completedTasks} pending</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityStats = (activityType: string, displayName: string) => (
    <div className={styles.contentSection}>
      <div className={styles.contentHeader}>
        <h2>{displayName} Analytics</h2>
        <p>Your {displayName.toLowerCase()} performance insights</p>
      </div>

      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h3>Coming Soon</h3>
        <p>Detailed {displayName.toLowerCase()} analytics including pace trends, distance graphs, and performance comparisons will be available here.</p>
      </div>
    </div>
  );

  const renderWeightAnalytics = () => (
    <div className={styles.contentSection}>
      <div className={styles.contentHeader}>
        <h2>Weight Tracking</h2>
        <p>Monitor your body weight trends</p>
      </div>

      {logsWithWeight.length > 1 ? (
        <>
          <div className={styles.weightStats}>
            <div className={styles.weightStatCard}>
              <span className={styles.weightStatLabel}>Current</span>
              <span className={styles.weightStatValue}>
                {logsWithWeight[logsWithWeight.length - 1]?.morningWeight ?? '—'} kg
              </span>
            </div>
            <div className={styles.weightStatCard}>
              <span className={styles.weightStatLabel}>Start</span>
              <span className={styles.weightStatValue}>
                {logsWithWeight[0]?.morningWeight ?? '—'} kg
              </span>
            </div>
            <div className={styles.weightStatCard}>
              <span className={styles.weightStatLabel}>Change</span>
              <span className={`${styles.weightStatValue} ${Number(weightTrend) < 0 ? styles.positive : Number(weightTrend) > 0 ? styles.negative : ''}`}>
                {weightTrend ? `${Number(weightTrend) > 0 ? '+' : ''}${weightTrend}` : '—'} kg
              </span>
            </div>
            <div className={styles.weightStatCard}>
              <span className={styles.weightStatLabel}>Min</span>
              <span className={styles.weightStatValue}>
                {Math.min(...logsWithWeight.map(l => l.morningWeight!))} kg
              </span>
            </div>
            <div className={styles.weightStatCard}>
              <span className={styles.weightStatLabel}>Max</span>
              <span className={styles.weightStatValue}>
                {Math.max(...logsWithWeight.map(l => l.morningWeight!))} kg
              </span>
            </div>
          </div>

          <div className={styles.weightChart}>
            <h3>Weight History</h3>
            <div className={styles.chartContainer}>
              {logsWithWeight.slice(-14).map((log, index, arr) => {
                const weights = arr.map(l => l.morningWeight!);
                const min = Math.min(...weights) - 1;
                const max = Math.max(...weights) + 1;
                const range = max - min;
                const height = ((log.morningWeight! - min) / range) * 100;
                
                return (
                  <div key={log.id} className={styles.chartBar}>
                    <div 
                      className={styles.bar}
                      style={{ height: `${height}%` }}
                      title={`${log.logDate}: ${log.morningWeight} kg`}
                    />
                    <span className={styles.chartLabel}>
                      {new Date(log.logDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={styles.chartLegend}>
              <span>Last {Math.min(logsWithWeight.length, 14)} entries</span>
              <span>
                Range: {Math.min(...logsWithWeight.slice(-14).map(l => l.morningWeight!))} - {Math.max(...logsWithWeight.slice(-14).map(l => l.morningWeight!))} kg
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="18" r="3" />
            </svg>
          </div>
          <h3>No Weight Data</h3>
          <p>Start logging your weight in the Daily Journal to see your trends here.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              <span className={styles.navLabel}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
}
