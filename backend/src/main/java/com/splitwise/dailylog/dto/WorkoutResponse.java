package com.splitwise.dailylog.dto;

import com.splitwise.domain.dailylog.Workout;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutResponse {

    private Long id;
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
    private String formattedPace;
    private String formattedDuration;

    // Strength specific
    private String exercises;
    private String setsReps;

    private String notes;
    private String analysis;

    public static WorkoutResponse fromWorkout(Workout workout) {
        return WorkoutResponse.builder()
                .id(workout.getId())
                .stravaActivityId(workout.getStravaActivity() != null ? workout.getStravaActivity().getId() : null)
                .workoutTime(workout.getWorkoutTime())
                .workoutType(workout.getWorkoutType())
                .durationMinutes(workout.getDurationMinutes())
                .caloriesBurned(workout.getCaloriesBurned())
                .distanceKm(workout.getDistanceKm())
                .avgPaceSeconds(workout.getAvgPaceSeconds())
                .avgHeartrate(workout.getAvgHeartrate())
                .maxHeartrate(workout.getMaxHeartrate())
                .formattedPace(formatPace(workout.getAvgPaceSeconds()))
                .formattedDuration(formatDuration(workout.getDurationMinutes()))
                .exercises(workout.getExercises())
                .setsReps(workout.getSetsReps())
                .notes(workout.getNotes())
                .analysis(workout.getAnalysis())
                .build();
    }

    private static String formatPace(Integer paceSeconds) {
        if (paceSeconds == null || paceSeconds == 0) return "--:--";
        int minutes = paceSeconds / 60;
        int seconds = paceSeconds % 60;
        return String.format("%d:%02d /km", minutes, seconds);
    }

    private static String formatDuration(Integer minutes) {
        if (minutes == null) return "--";
        if (minutes >= 60) {
            return String.format("%dh %dm", minutes / 60, minutes % 60);
        }
        return String.format("%d min", minutes);
    }
}

