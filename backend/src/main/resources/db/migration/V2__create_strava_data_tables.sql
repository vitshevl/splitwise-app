-- Strava Activities table
CREATE TABLE strava_data.activities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users.users(id),
    strava_id BIGINT UNIQUE,
    name VARCHAR(255),
    type VARCHAR(50),
    sport_type VARCHAR(50),
    start_date TIMESTAMP WITH TIME ZONE,
    start_date_local TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(100),
    distance DECIMAL(12, 2),
    moving_time INTEGER,
    elapsed_time INTEGER,
    total_elevation_gain DECIMAL(10, 2),
    elev_high DECIMAL(10, 2),
    elev_low DECIMAL(10, 2),
    average_speed DECIMAL(8, 4),
    max_speed DECIMAL(8, 4),
    average_heartrate DECIMAL(5, 2),
    max_heartrate INTEGER,
    average_cadence DECIMAL(6, 2),
    average_temp DECIMAL(5, 2),
    calories INTEGER,
    description TEXT,
    device_name VARCHAR(100),
    external_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activities_user_id ON strava_data.activities(user_id);
CREATE INDEX idx_activities_strava_id ON strava_data.activities(strava_id);
CREATE INDEX idx_activities_start_date ON strava_data.activities(start_date);
CREATE INDEX idx_activities_type ON strava_data.activities(type);

-- Activity Laps table
CREATE TABLE strava_data.activity_laps (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES strava_data.activities(id) ON DELETE CASCADE,
    strava_lap_id BIGINT,
    name VARCHAR(100),
    lap_index INTEGER,
    start_date TIMESTAMP WITH TIME ZONE,
    distance DECIMAL(12, 2),
    moving_time INTEGER,
    elapsed_time INTEGER,
    total_elevation_gain DECIMAL(10, 2),
    average_speed DECIMAL(8, 4),
    max_speed DECIMAL(8, 4),
    average_heartrate DECIMAL(5, 2),
    max_heartrate INTEGER,
    average_cadence DECIMAL(6, 2),
    pace_zone INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_laps_activity_id ON strava_data.activity_laps(activity_id);

-- Activity Splits (per kilometer/mile) table
CREATE TABLE strava_data.activity_splits (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES strava_data.activities(id) ON DELETE CASCADE,
    split_index INTEGER NOT NULL,
    distance DECIMAL(12, 2),
    elapsed_time INTEGER,
    moving_time INTEGER,
    elevation_difference DECIMAL(10, 2),
    average_speed DECIMAL(8, 4),
    average_heartrate DECIMAL(5, 2),
    pace_zone INTEGER,
    is_metric BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_splits_activity_id ON strava_data.activity_splits(activity_id);

-- Activity Streams (detailed GPS/HR data) - optional for detailed analysis
CREATE TABLE strava_data.activity_streams (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES strava_data.activities(id) ON DELETE CASCADE,
    stream_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    series_type VARCHAR(20),
    original_size INTEGER,
    resolution VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_streams_activity_id ON strava_data.activity_streams(activity_id);
CREATE INDEX idx_streams_type ON strava_data.activity_streams(stream_type);

