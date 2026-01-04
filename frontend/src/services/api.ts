import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import type { Activity, ActivityStats, PageResponse } from '../types/activity';
import type { DailyLog, DailyLogRequest, Meal, MealRequest, Workout, WorkoutRequest } from '../types/journal';
import type { TrainingTask, TrainingTaskRequest } from '../types/training';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(response.status, message || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: (): Promise<User> => request('/auth/me'),
};

export const activitiesApi = {
  getActivities: (page = 0, size = 20, type?: string): Promise<PageResponse<Activity>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (type) params.append('type', type);
    return request(`/activities?${params}`);
  },

  getActivity: (id: number): Promise<Activity> =>
    request(`/activities/${id}`),

  getStats: (): Promise<ActivityStats> =>
    request('/activities/stats'),
};

export const journalApi = {
  getDailyLogs: (page = 0, size = 20): Promise<PageResponse<DailyLog>> =>
    request(`/daily-logs?page=${page}&size=${size}`),

  getDailyLog: (id: number): Promise<DailyLog> =>
    request(`/daily-logs/${id}`),

  getDailyLogByDate: (date: string): Promise<DailyLog> =>
    request(`/daily-logs/date/${date}`),

  createDailyLog: (data: DailyLogRequest): Promise<DailyLog> =>
    request('/daily-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateDailyLog: (id: number, data: DailyLogRequest): Promise<DailyLog> =>
    request(`/daily-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteDailyLog: (id: number): Promise<void> =>
    request(`/daily-logs/${id}`, { method: 'DELETE' }),

  // Meals
  addMeal: (logId: number, data: MealRequest): Promise<Meal> =>
    request(`/daily-logs/${logId}/meals`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMeal: (logId: number, mealId: number, data: MealRequest): Promise<Meal> =>
    request(`/daily-logs/${logId}/meals/${mealId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMeal: (logId: number, mealId: number): Promise<void> =>
    request(`/daily-logs/${logId}/meals/${mealId}`, { method: 'DELETE' }),

  // Workouts
  addWorkout: (logId: number, data: WorkoutRequest): Promise<Workout> =>
    request(`/daily-logs/${logId}/workouts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateWorkout: (logId: number, workoutId: number, data: WorkoutRequest): Promise<Workout> =>
    request(`/daily-logs/${logId}/workouts/${workoutId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteWorkout: (logId: number, workoutId: number): Promise<void> =>
    request(`/daily-logs/${logId}/workouts/${workoutId}`, { method: 'DELETE' }),

  // Water
  addWater: (logId: number, amountMl: number): Promise<void> =>
    request(`/daily-logs/${logId}/water`, {
      method: 'POST',
      body: JSON.stringify({ amountMl }),
    }),
};

export const trainingApi = {
  getTasks: (page = 0, size = 50): Promise<PageResponse<TrainingTask>> =>
    request(`/training-tasks?page=${page}&size=${size}`),

  getTask: (id: number): Promise<TrainingTask> =>
    request(`/training-tasks/${id}`),

  getTasksByDate: (date: string): Promise<TrainingTask[]> =>
    request(`/training-tasks/date/${date}`),

  getTasksByDateRange: (startDate: string, endDate: string): Promise<TrainingTask[]> =>
    request(`/training-tasks/range?startDate=${startDate}&endDate=${endDate}`),

  getPendingTasks: (): Promise<TrainingTask[]> =>
    request('/training-tasks/pending'),

  createTask: (data: TrainingTaskRequest): Promise<TrainingTask> =>
    request('/training-tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTask: (id: number, data: TrainingTaskRequest): Promise<TrainingTask> =>
    request(`/training-tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleComplete: (id: number): Promise<TrainingTask> =>
    request(`/training-tasks/${id}/toggle`, { method: 'PATCH' }),

  deleteTask: (id: number): Promise<void> =>
    request(`/training-tasks/${id}`, { method: 'DELETE' }),
};

export { ApiError };
