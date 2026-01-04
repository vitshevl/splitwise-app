import { useEffect, useState } from 'react';
import { activitiesApi, journalApi, trainingApi } from '../services/api';
import type { ActivityStats } from '../types/activity';
import type { DailyLog } from '../types/journal';
import type { TrainingTask } from '../types/training';
import styles from './Analytics.module.css';

export default function Analytics() {
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

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics</h1>
        <p>Your performance insights and trends</p>
      </div>

      <div className={styles.section}>
        <h2>Running Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{activityStats?.totalActivities ?? 0}</span>
              <span className={styles.statLabel}>Total Runs</span>
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
      </div>

      <div className={styles.section}>
        <h2>Journal Insights</h2>
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
              <span className={styles.insightTitle}>Journal Entries</span>
            </div>
            <span className={styles.insightValue}>{recentLogs.length}</span>
            <span className={styles.insightUnit}>last 30 days</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Training Progress</h2>
        <div className={styles.progressSection}>
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

          <div className={styles.tasksSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{trainingTasks.length}</span>
              <span className={styles.summaryLabel}>Total Tasks</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{completedTasks}</span>
              <span className={styles.summaryLabel}>Completed</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{trainingTasks.length - completedTasks}</span>
              <span className={styles.summaryLabel}>Pending</span>
            </div>
          </div>
        </div>
      </div>

      {logsWithWeight.length > 1 && (
        <div className={styles.section}>
          <h2>Weight History</h2>
          <div className={styles.weightChart}>
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
        </div>
      )}
    </div>
  );
}

