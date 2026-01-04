package com.splitwise.dailylog.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class WorkoutRequest {

    private Long stravaActivityId;
    private LocalTime workoutTime;
    private String workoutType;
    private Integer durationMinutes;
    private Integer caloriesBurned;

    // Running specific
    private BigDecimal distanceKm;
    private Integer avgPaceSeconds;
    private Integer avgHeartrate;
    private Integer maxHeartrate;

    // Strength specific
    private String exercises;
    private String setsReps;

    private String notes;
    private String analysis;
}

