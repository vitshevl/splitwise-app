-- Create schema for coach trainings
CREATE SCHEMA IF NOT EXISTS coach_trainings;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA coach_trainings TO splitwise;

-- Training tasks table
CREATE TABLE coach_trainings.training_tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users.users(id),
    task_date DATE NOT NULL,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_training_tasks_user_id ON coach_trainings.training_tasks(user_id);
CREATE INDEX idx_training_tasks_date ON coach_trainings.training_tasks(task_date);

