export interface Activity {
  id: number;
  stravaId: number | null;
  name: string;
  type: string;
  sportType: string | null;
  startDate: string;
  startDateLocal: string | null;
  timezone: string | null;
  distance: number | null;
  movingTime: number | null;
  elapsedTime: number | null;
  totalElevationGain: number | null;
  elevHigh: number | null;
  elevLow: number | null;
  averageSpeed: number | null;
  maxSpeed: number | null;
  averageHeartrate: number | null;
  maxHeartrate: number | null;
  averageCadence: number | null;
  averageTemp: number | null;
  calories: number | null;
  description: string | null;
  deviceName: string | null;
  formattedPace: string;
  formattedDuration: string;
  formattedDistance: string;
}

export interface ActivityStats {
  totalActivities: number;
  totalDistance: string;
  totalDuration: string;
  totalDistanceMeters: number;
  totalDurationSeconds: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

