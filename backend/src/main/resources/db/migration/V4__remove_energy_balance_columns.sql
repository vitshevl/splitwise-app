-- Remove energy balance columns from daily_logs table
ALTER TABLE daily_activities_log.daily_logs
    DROP COLUMN IF EXISTS calories_consumed,
    DROP COLUMN IF EXISTS calories_burned,
    DROP COLUMN IF EXISTS calorie_deficit,
    DROP COLUMN IF EXISTS bmr,
    DROP COLUMN IF EXISTS steps,
    DROP COLUMN IF EXISTS active_minutes,
    DROP COLUMN IF EXISTS distance_km,
    DROP COLUMN IF EXISTS energy_balance_notes;

