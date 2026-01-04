-- Daily Log main table
CREATE TABLE daily_activities_log.daily_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users.users(id),
    log_date DATE NOT NULL,
    morning_weight DECIMAL(5, 2),
    
    -- Energy balance
    calories_consumed INTEGER,
    calories_burned INTEGER,
    calorie_deficit INTEGER,
    bmr INTEGER,
    
    -- Activity summary
    steps INTEGER,
    active_minutes INTEGER,
    distance_km DECIMAL(8, 2),
    
    -- Overall notes
    activity_notes TEXT,
    nutrition_notes TEXT,
    energy_balance_notes TEXT,
    feelings_notes TEXT,
    
    -- Sleep tracking
    sleep_hours DECIMAL(4, 2),
    sleep_quality VARCHAR(20),
    
    -- Weather conditions (for outdoor activities)
    weather_temp DECIMAL(5, 2),
    weather_humidity INTEGER,
    weather_conditions VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, log_date)
);

CREATE INDEX idx_daily_logs_user_id ON daily_activities_log.daily_logs(user_id);
CREATE INDEX idx_daily_logs_date ON daily_activities_log.daily_logs(log_date);

-- Meals table for detailed nutrition tracking
CREATE TABLE daily_activities_log.meals (
    id BIGSERIAL PRIMARY KEY,
    daily_log_id BIGINT NOT NULL REFERENCES daily_activities_log.daily_logs(id) ON DELETE CASCADE,
    meal_time TIME,
    meal_type VARCHAR(50),
    description TEXT,
    calories INTEGER,
    protein_grams DECIMAL(6, 2),
    carbs_grams DECIMAL(6, 2),
    fat_grams DECIMAL(6, 2),
    fiber_grams DECIMAL(6, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meals_daily_log_id ON daily_activities_log.meals(daily_log_id);

-- Workouts table for manual workout entries (not from Strava)
CREATE TABLE daily_activities_log.workouts (
    id BIGSERIAL PRIMARY KEY,
    daily_log_id BIGINT NOT NULL REFERENCES daily_activities_log.daily_logs(id) ON DELETE CASCADE,
    strava_activity_id BIGINT REFERENCES strava_data.activities(id),
    workout_time TIME,
    workout_type VARCHAR(100),
    duration_minutes INTEGER,
    calories_burned INTEGER,
    
    -- Running specific
    distance_km DECIMAL(8, 2),
    avg_pace_seconds INTEGER,
    avg_heartrate INTEGER,
    max_heartrate INTEGER,
    
    -- Strength specific
    exercises TEXT,
    sets_reps TEXT,
    
    notes TEXT,
    analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workouts_daily_log_id ON daily_activities_log.workouts(daily_log_id);

-- Water intake tracking
CREATE TABLE daily_activities_log.water_intake (
    id BIGSERIAL PRIMARY KEY,
    daily_log_id BIGINT NOT NULL REFERENCES daily_activities_log.daily_logs(id) ON DELETE CASCADE,
    amount_ml INTEGER NOT NULL,
    intake_time TIME,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_water_daily_log_id ON daily_activities_log.water_intake(daily_log_id);

-- Body measurements tracking (weekly/periodic)
CREATE TABLE daily_activities_log.body_measurements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users.users(id),
    measurement_date DATE NOT NULL,
    weight DECIMAL(5, 2),
    body_fat_percentage DECIMAL(4, 2),
    muscle_mass DECIMAL(5, 2),
    waist_cm DECIMAL(5, 2),
    chest_cm DECIMAL(5, 2),
    hips_cm DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_measurements_user_id ON daily_activities_log.body_measurements(user_id);
CREATE INDEX idx_measurements_date ON daily_activities_log.body_measurements(measurement_date);

