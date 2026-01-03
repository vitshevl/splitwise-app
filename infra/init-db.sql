-- Create schemas for Splitwise application

CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS strava_data;
CREATE SCHEMA IF NOT EXISTS daily_activities_log;

-- Grant permissions to the splitwise user
GRANT ALL PRIVILEGES ON SCHEMA users TO splitwise;
GRANT ALL PRIVILEGES ON SCHEMA strava_data TO splitwise;
GRANT ALL PRIVILEGES ON SCHEMA daily_activities_log TO splitwise;

