import { useEffect, useState } from 'react';
import { activitiesApi } from '../services/api';
import type { Activity } from '../types/activity';
import styles from './Activities.module.css';

type ActivityType = 'Run' | 'Walk' | 'Ride' | 'all';
type ChartPeriod = '4w' | '12w' | '6m' | 'ytd' | string; // string for year like "2024"

interface WeeklyStats {
  distance: number;
  time: number;
  elevation: number;
}

interface WeekData {
  weekStart: Date;
  distance: number;
}

interface PeriodOption {
  value: ChartPeriod;
  label: string;
}

const getYearOptions = (): PeriodOption[] => {
  const currentYear = new Date().getFullYear();
  const years: PeriodOption[] = [];
  // Show last 3 years
  for (let year = currentYear; year >= currentYear - 2; year--) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
};

const basePeriodOptions: PeriodOption[] = [
  { value: '4w', label: '4 weeks' },
  { value: '12w', label: '12 weeks' },
  { value: '6m', label: '6 months' },
  { value: 'ytd', label: 'YTD' },
];

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ActivityType>('Run');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('ytd');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const periodOptions = [...basePeriodOptions, ...getYearOptions()];

  useEffect(() => {
    loadActivities();
  }, [page, selectedType]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const type = selectedType === 'all' ? undefined : selectedType;
      const response = await activitiesApi.getActivities(page, 20, type);
      setActivities(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate this week's stats
  const getThisWeekStats = (): WeeklyStats => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekActivities = activities.filter(a => {
      const activityDate = new Date(a.startDate);
      return activityDate >= startOfWeek && 
             (selectedType === 'all' || a.type === selectedType);
    });

    return {
      distance: thisWeekActivities.reduce((sum, a) => sum + (a.distance || 0), 0),
      time: thisWeekActivities.reduce((sum, a) => sum + (a.movingTime || 0), 0),
      elevation: thisWeekActivities.reduce((sum, a) => sum + (a.totalElevationGain || 0), 0),
    };
  };

  // Get weekly data for chart based on selected period
  const getWeeklyData = (): WeekData[] => {
    const weeks: WeekData[] = [];
    const now = new Date();
    
    let startDate: Date;
    let endDate: Date = new Date(now);
    
    // Determine the date range based on period
    if (chartPeriod === '4w') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 28);
    } else if (chartPeriod === '12w') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 84);
    } else if (chartPeriod === '6m') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 6);
    } else if (chartPeriod === 'ytd') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      // Specific year like "2024"
      const year = parseInt(chartPeriod);
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }
    
    // Align to Monday of the start week
    const dayOfWeek = startDate.getDay();
    if (dayOfWeek !== 1) { // If not Monday
      // For specific years, go forward to next Monday to avoid showing previous year
      if (!isNaN(parseInt(chartPeriod))) {
        const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
        startDate.setDate(startDate.getDate() + daysUntilMonday);
      } else {
        // For relative periods, go back to previous Monday
        startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      }
    }
    startDate.setHours(0, 0, 0, 0);
    
    // Generate weeks
    const currentWeekStart = new Date(startDate);
    while (currentWeekStart <= endDate) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 7);

      const weekDistance = activities
        .filter(a => {
          const activityDate = new Date(a.startDate);
          return activityDate >= currentWeekStart && 
                 activityDate < weekEnd &&
                 (selectedType === 'all' || a.type === selectedType);
        })
        .reduce((sum, a) => sum + (a.distance || 0), 0);

      weeks.push({ weekStart: new Date(currentWeekStart), distance: weekDistance });
      
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    return weeks;
  };

  const weeklyStats = getThisWeekStats();
  const weeklyData = getWeeklyData();
  const maxWeekDistance = Math.max(...weeklyData.map(w => w.distance), 1);

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return km.toFixed(2).replace('.', ',');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMonthLabel = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const activityTypes: { type: ActivityType; label: string; icon: JSX.Element }[] = [
    {
      type: 'Run',
      label: 'Run',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.typeIcon}>
          <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
        </svg>
      ),
    },
    {
      type: 'Walk',
      label: 'Walk',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.typeIcon}>
          <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
        </svg>
      ),
    },
    {
      type: 'Ride',
      label: 'Ride',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.typeIcon}>
          <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Activity Type Filters */}
      <div className={styles.typeFilters}>
        {activityTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => { setSelectedType(type); setPage(0); }}
            className={`${styles.typeButton} ${selectedType === type ? styles.active : ''}`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* This Week Summary */}
      <div className={styles.weekSummary}>
        <h2>This week</h2>
        <div className={styles.weekStats}>
          <div className={styles.weekStat}>
            <span className={styles.weekStatLabel}>Distance</span>
            <span className={styles.weekStatValue}>
              {formatDistance(weeklyStats.distance)} <span className={styles.unit}>km</span>
            </span>
          </div>
          <div className={styles.weekStat}>
            <span className={styles.weekStatLabel}>Time</span>
            <span className={styles.weekStatValue}>{formatDuration(weeklyStats.time)}</span>
          </div>
          <div className={styles.weekStat}>
            <span className={styles.weekStatLabel}>Elevation</span>
            <span className={styles.weekStatValue}>
              {Math.round(weeklyStats.elevation)} <span className={styles.unit}>m</span>
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3>Activity</h3>
          <div className={styles.periodSelector}>
            {periodOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setChartPeriod(value)}
                className={`${styles.periodBtn} ${chartPeriod === value ? styles.active : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.chartContainer}>
        <div className={styles.chartYAxis}>
          <span>{Math.round(maxWeekDistance / 1000)} km</span>
          <span>{Math.round(maxWeekDistance / 2000)} km</span>
          <span>0 km</span>
        </div>
        <div className={styles.chart}>
          {weeklyData.map((week, index) => {
            const height = maxWeekDistance > 0 ? (week.distance / maxWeekDistance) * 100 : 0;
            const isCurrentWeek = index === weeklyData.length - 1;
            const showMonth = index === 0 || 
              week.weekStart.getMonth() !== weeklyData[index - 1]?.weekStart.getMonth();
            
            return (
              <div key={index} className={styles.chartColumn}>
                <div className={styles.chartBarContainer}>
                  <div 
                    className={`${styles.chartBar} ${isCurrentWeek ? styles.current : ''}`}
                    style={{ height: `${height}%` }}
                  />
                  {week.distance > 0 && (
                    <div className={styles.chartDot} style={{ bottom: `${height}%` }}>
                      {isCurrentWeek && (
                        <span className={styles.chartValue}>
                          {Math.round(week.distance / 1000)} km
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {showMonth && (
                  <span className={styles.chartMonth}>{getMonthLabel(week.weekStart)}</span>
                )}
              </div>
            );
          })}
          <svg className={styles.chartLine} preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              points={weeklyData.map((week, index) => {
                const x = (index / (weeklyData.length - 1)) * 100;
                const y = 100 - (maxWeekDistance > 0 ? (week.distance / maxWeekDistance) * 100 : 0);
                return `${x}%,${y}%`;
              }).join(' ')}
            />
          </svg>
        </div>
        </div>
      </div>

      {/* Activities List */}
      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      ) : activities.length === 0 ? (
        <div className={styles.empty}>
          <p>No {selectedType !== 'all' ? selectedType.toLowerCase() : ''} activities yet</p>
        </div>
      ) : (
        <div className={styles.activitiesList}>
          {activities.map((activity) => (
            <div key={activity.id} className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <div className={styles.activityMeta}>
                  <span className={styles.activityDate}>
                    {formatDate(activity.startDate)} at {formatTime(activity.startDate)}
                  </span>
                  <h3 className={styles.activityName}>{activity.name}</h3>
                </div>
                <span className={styles.activityType}>{activity.type}</span>
              </div>
              <div className={styles.activityStats}>
                <div className={styles.activityStat}>
                  <span className={styles.activityStatValue}>{activity.formattedDistance}</span>
                  <span className={styles.activityStatLabel}>Distance</span>
                </div>
                <div className={styles.activityStat}>
                  <span className={styles.activityStatValue}>{activity.formattedPace}</span>
                  <span className={styles.activityStatLabel}>Pace</span>
                </div>
                <div className={styles.activityStat}>
                  <span className={styles.activityStatValue}>{activity.formattedDuration}</span>
                  <span className={styles.activityStatLabel}>Time</span>
                </div>
                {activity.averageHeartrate && (
                  <div className={styles.activityStat}>
                    <span className={styles.activityStatValue}>{Math.round(activity.averageHeartrate)}</span>
                    <span className={styles.activityStatLabel}>Avg HR</span>
                  </div>
                )}
                {activity.totalElevationGain && activity.totalElevationGain > 0 && (
                  <div className={styles.activityStat}>
                    <span className={styles.activityStatValue}>{Math.round(activity.totalElevationGain)} m</span>
                    <span className={styles.activityStatLabel}>Elev Gain</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
