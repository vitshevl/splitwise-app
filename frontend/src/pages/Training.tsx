import { useEffect, useState } from 'react';
import { trainingApi } from '../services/api';
import type { TrainingTask, TrainingTaskRequest } from '../types/training';
import styles from './Training.module.css';

export default function Training() {
  const [tasks, setTasks] = useState<TrainingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TrainingTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await trainingApi.getTasks(0, 100);
      setTasks(response.content);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: TrainingTaskRequest) => {
    try {
      const newTask = await trainingApi.createTask(data);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdate = async (id: number, data: TrainingTaskRequest) => {
    try {
      const updatedTask = await trainingApi.updateTask(id, data);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updatedTask = await trainingApi.toggleComplete(id);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await trainingApi.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = task.taskDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, TrainingTask[]>);

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = new Date(dateString + 'T00:00:00');
    
    if (taskDate.getTime() === today.getTime()) return 'Today';
    if (taskDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const pendingCount = tasks.filter(t => !t.isCompleted).length;

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading training tasks...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Coach Training</h1>
          <p>Tasks and workouts from your coach</p>
        </div>
        <button onClick={() => setShowForm(true)} className={styles.addBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Task
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{tasks.length}</span>
          <span className={styles.statLabel}>Total Tasks</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{pendingCount}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{tasks.length - pendingCount}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`}
        >
          Completed
        </button>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(data) => handleUpdate(editingTask.id, data)}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {sortedDates.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2>No training tasks</h2>
          <p>Add your first training task from your coach.</p>
        </div>
      ) : (
        <div className={styles.tasksList}>
          {sortedDates.map((date) => (
            <div key={date} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{formatDate(date)}</h3>
              <div className={styles.tasksForDate}>
                {groupedTasks[date].map((task) => (
                  <div
                    key={task.id}
                    className={`${styles.taskCard} ${task.isCompleted ? styles.completed : ''}`}
                  >
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={styles.checkbox}
                    >
                      {task.isCompleted && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className={styles.taskContent}>
                      <p className={styles.taskDescription}>{task.description}</p>
                      {task.notes && (
                        <span className={styles.taskNotes}>{task.notes}</span>
                      )}
                    </div>
                    <div className={styles.taskActions}>
                      <button
                        onClick={() => setEditingTask(task)}
                        className={styles.actionBtn}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskForm({
  task,
  onSubmit,
  onCancel,
}: {
  task?: TrainingTask;
  onSubmit: (data: TrainingTaskRequest) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<TrainingTaskRequest>({
    taskDate: task?.taskDate || new Date().toISOString().split('T')[0],
    description: task?.description || '',
    isCompleted: task?.isCompleted || false,
    notes: task?.notes || undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.formOverlay}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formHeader}>
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button type="button" onClick={onCancel} className={styles.closeBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.field}>
          <label>Date</label>
          <input
            type="date"
            value={formData.taskDate}
            onChange={(e) => setFormData({ ...formData, taskDate: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Training task description..."
            rows={4}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Notes (optional)</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value || undefined })}
            placeholder="Additional notes..."
            rows={2}
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            {task ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

