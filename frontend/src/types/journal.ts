export interface DailyLog {
  id: number;
  logDate: string;
  morningWeight: number | null;
  activityNotes: string | null;
  nutritionNotes: string | null;
  feelingsNotes: string | null;
  sleepHours: number | null;
  sleepQuality: string | null;
  weatherTemp: number | null;
  weatherHumidity: number | null;
  weatherConditions: string | null;
  meals: Meal[];
  workouts: Workout[];
  totalWaterMl: number;
}

export interface Meal {
  id: number;
  mealTime: string | null;
  mealType: string | null;
  description: string | null;
  calories: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
  fiberGrams: number | null;
  notes: string | null;
}

export interface Workout {
  id: number;
  stravaActivityId: number | null;
  workoutTime: string | null;
  workoutType: string | null;
  durationMinutes: number | null;
  caloriesBurned: number | null;
  distanceKm: number | null;
  avgPaceSeconds: number | null;
  avgHeartrate: number | null;
  maxHeartrate: number | null;
  formattedPace: string | null;
  formattedDuration: string | null;
  exercises: string | null;
  setsReps: string | null;
  notes: string | null;
  analysis: string | null;
}

export interface DailyLogRequest {
  logDate: string;
  morningWeight?: number;
  activityNotes?: string;
  nutritionNotes?: string;
  feelingsNotes?: string;
  sleepHours?: number;
  sleepQuality?: string;
  weatherTemp?: number;
  weatherHumidity?: number;
  weatherConditions?: string;
}

export interface MealRequest {
  mealTime?: string;
  mealType?: string;
  description?: string;
  calories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
  fiberGrams?: number;
  notes?: string;
}

export interface WorkoutRequest {
  stravaActivityId?: number;
  workoutTime?: string;
  workoutType?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  distanceKm?: number;
  avgPaceSeconds?: number;
  avgHeartrate?: number;
  maxHeartrate?: number;
  exercises?: string;
  setsReps?: string;
  notes?: string;
  analysis?: string;
}
