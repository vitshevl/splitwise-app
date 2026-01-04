import { useEffect, useState } from 'react';
import { journalApi } from '../services/api';
import type { DailyLog, DailyLogRequest } from '../types/journal';
import styles from './Journal.module.css';

export default function Journal() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const response = await journalApi.getDailyLogs(0, 30);
      setLogs(response.content);
      if (response.content.length > 0) {
        setSelectedLog(response.content[0]);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLog = async (data: DailyLogRequest) => {
    try {
      const newLog = await journalApi.createDailyLog(data);
      setLogs([newLog, ...logs]);
      setSelectedLog(newLog);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create log:', error);
    }
  };

  const handleUpdateLog = async (id: number, data: DailyLogRequest) => {
    try {
      const updatedLog = await journalApi.updateDailyLog(id, data);
      setLogs(logs.map(l => l.id === id ? updatedLog : l));
      setSelectedLog(updatedLog);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update log:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading journal...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Journal</h2>
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <div className={styles.logsList}>
          {logs.map((log) => (
            <button
              key={log.id}
              onClick={() => { setSelectedLog(log); setIsEditing(false); setShowForm(false); }}
              className={`${styles.logItem} ${selectedLog?.id === log.id ? styles.active : ''}`}
            >
              <span className={styles.logDate}>{formatShortDate(log.logDate)}</span>
              <div className={styles.logPreview}>
                {log.morningWeight && <span>{log.morningWeight} kg</span>}
                {log.sleepHours && <span>{log.sleepHours}h sleep</span>}
              </div>
            </button>
          ))}
          {logs.length === 0 && (
            <div className={styles.emptyList}>
              <p>No journal entries yet</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.main}>
        {showForm ? (
          <LogForm
            onSubmit={handleCreateLog}
            onCancel={() => setShowForm(false)}
            initialDate={today}
          />
        ) : selectedLog ? (
          isEditing ? (
            <LogForm
              log={selectedLog}
              onSubmit={(data) => handleUpdateLog(selectedLog.id, data)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <LogDetail log={selectedLog} onEdit={() => setIsEditing(true)} />
          )
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2>Start your journal</h2>
            <p>Track your daily activities, nutrition, and feelings.</p>
            <button onClick={() => setShowForm(true)} className={styles.createBtn}>
              Create First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LogDetail({ log, onEdit }: { log: DailyLog; onEdit: () => void }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        <h1>{formatDate(log.logDate)}</h1>
        <button onClick={onEdit} className={styles.editBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
      </div>

      <div className={styles.metricsGrid}>
        {log.morningWeight && (
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{log.morningWeight}</span>
            <span className={styles.metricUnit}>kg</span>
            <span className={styles.metricLabel}>Weight</span>
          </div>
        )}
        {log.totalWaterMl > 0 && (
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{(log.totalWaterMl / 1000).toFixed(1)}</span>
            <span className={styles.metricUnit}>L</span>
            <span className={styles.metricLabel}>Water</span>
          </div>
        )}
        {log.sleepHours && (
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{log.sleepHours}</span>
            <span className={styles.metricUnit}>hrs</span>
            <span className={styles.metricLabel}>Sleep</span>
          </div>
        )}
      </div>

      {(log.activityNotes || log.nutritionNotes || log.feelingsNotes) && (
        <div className={styles.notesSection}>
          {log.activityNotes && (
            <div className={styles.noteCard}>
              <h3>Activity</h3>
              <p>{log.activityNotes}</p>
            </div>
          )}
          {log.nutritionNotes && (
            <div className={styles.noteCard}>
              <h3>Nutrition</h3>
              <p>{log.nutritionNotes}</p>
            </div>
          )}
          {log.feelingsNotes && (
            <div className={styles.noteCard}>
              <h3>Feelings</h3>
              <p>{log.feelingsNotes}</p>
            </div>
          )}
        </div>
      )}

      {log.meals.length > 0 && (
        <div className={styles.section}>
          <h3>Meals</h3>
          <div className={styles.mealsList}>
            {log.meals.map((meal) => (
              <div key={meal.id} className={styles.mealCard}>
                <div className={styles.mealHeader}>
                  <span className={styles.mealType}>{meal.mealType || 'Meal'}</span>
                  {meal.mealTime && <span className={styles.mealTime}>{meal.mealTime}</span>}
                </div>
                {meal.description && <p className={styles.mealDesc}>{meal.description}</p>}
                <div className={styles.macros}>
                  {meal.calories && <span>{meal.calories} kcal</span>}
                  {meal.proteinGrams && <span>P: {meal.proteinGrams}g</span>}
                  {meal.carbsGrams && <span>C: {meal.carbsGrams}g</span>}
                  {meal.fatGrams && <span>F: {meal.fatGrams}g</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {log.workouts.length > 0 && (
        <div className={styles.section}>
          <h3>Workouts</h3>
          <div className={styles.workoutsList}>
            {log.workouts.map((workout) => (
              <div key={workout.id} className={styles.workoutCard}>
                <div className={styles.workoutHeader}>
                  <span className={styles.workoutType}>{workout.workoutType || 'Workout'}</span>
                  {workout.workoutTime && <span className={styles.workoutTime}>{workout.workoutTime}</span>}
                </div>
                <div className={styles.workoutStats}>
                  {workout.durationMinutes && <span>{workout.formattedDuration}</span>}
                  {workout.distanceKm && <span>{workout.distanceKm} km</span>}
                  {workout.caloriesBurned && <span>{workout.caloriesBurned} kcal</span>}
                  {workout.avgHeartrate && <span>{workout.avgHeartrate} bpm</span>}
                </div>
                {workout.notes && <p className={styles.workoutNotes}>{workout.notes}</p>}
                {workout.analysis && (
                  <div className={styles.workoutAnalysis}>
                    <strong>Analysis:</strong> {workout.analysis}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LogForm({
  log,
  onSubmit,
  onCancel,
  initialDate,
}: {
  log?: DailyLog;
  onSubmit: (data: DailyLogRequest) => void;
  onCancel: () => void;
  initialDate?: string;
}) {
  const [formData, setFormData] = useState<DailyLogRequest>({
    logDate: log?.logDate || initialDate || new Date().toISOString().split('T')[0],
    morningWeight: log?.morningWeight || undefined,
    caloriesConsumed: log?.caloriesConsumed || undefined,
    caloriesBurned: log?.caloriesBurned || undefined,
    calorieDeficit: log?.calorieDeficit || undefined,
    bmr: log?.bmr || undefined,
    steps: log?.steps || undefined,
    activeMinutes: log?.activeMinutes || undefined,
    activityNotes: log?.activityNotes || undefined,
    nutritionNotes: log?.nutritionNotes || undefined,
    energyBalanceNotes: log?.energyBalanceNotes || undefined,
    feelingsNotes: log?.feelingsNotes || undefined,
    sleepHours: log?.sleepHours || undefined,
    sleepQuality: log?.sleepQuality || undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <h2>{log ? 'Edit Entry' : 'New Entry'}</h2>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>

      <div className={styles.formSection}>
        <h3>Basic Info</h3>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Date</label>
            <input
              type="date"
              value={formData.logDate}
              onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
              required
              disabled={!!log}
            />
          </div>
          <div className={styles.field}>
            <label>Morning Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.morningWeight || ''}
              onChange={(e) => setFormData({ ...formData, morningWeight: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g., 75.5"
            />
          </div>
          <div className={styles.field}>
            <label>Sleep Hours</label>
            <input
              type="number"
              step="0.5"
              value={formData.sleepHours || ''}
              onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g., 7.5"
            />
          </div>
        </div>
      </div>


      <div className={styles.formSection}>
        <h3>Notes</h3>
        <div className={styles.field}>
          <label>Activity Notes</label>
          <textarea
            value={formData.activityNotes || ''}
            onChange={(e) => setFormData({ ...formData, activityNotes: e.target.value || undefined })}
            placeholder="Describe your physical activities for the day..."
            rows={3}
          />
        </div>
        <div className={styles.field}>
          <label>Nutrition Notes</label>
          <textarea
            value={formData.nutritionNotes || ''}
            onChange={(e) => setFormData({ ...formData, nutritionNotes: e.target.value || undefined })}
            placeholder="What did you eat today..."
            rows={3}
          />
        </div>
        <div className={styles.field}>
          <label>Feelings / How You Felt</label>
          <textarea
            value={formData.feelingsNotes || ''}
            onChange={(e) => setFormData({ ...formData, feelingsNotes: e.target.value || undefined })}
            placeholder="How did you feel today..."
            rows={3}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn}>
          {log ? 'Save Changes' : 'Create Entry'}
        </button>
      </div>
    </form>
  );
}

