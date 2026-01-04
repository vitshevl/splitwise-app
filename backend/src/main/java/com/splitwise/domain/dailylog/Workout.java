package com.splitwise.domain.dailylog;

import com.splitwise.domain.strava.Activity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "workouts", schema = "daily_activities_log")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_log_id", nullable = false)
    private DailyLog dailyLog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strava_activity_id")
    private Activity stravaActivity;

    @Column(name = "workout_time")
    private LocalTime workoutTime;

    @Column(name = "workout_type")
    private String workoutType;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    // Running specific
    @Column(name = "distance_km", precision = 8, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "avg_pace_seconds")
    private Integer avgPaceSeconds;

    @Column(name = "avg_heartrate")
    private Integer avgHeartrate;

    @Column(name = "max_heartrate")
    private Integer maxHeartrate;

    // Strength specific
    @Column(columnDefinition = "TEXT")
    private String exercises;

    @Column(name = "sets_reps", columnDefinition = "TEXT")
    private String setsReps;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String analysis;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}

