export interface TrainingTask {
  id: number;
  taskDate: string;
  description: string;
  isCompleted: boolean;
  notes: string | null;
}

export interface TrainingTaskRequest {
  taskDate: string;
  description: string;
  isCompleted?: boolean;
  notes?: string;
}

