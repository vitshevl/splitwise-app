package com.splitwise.dailylog.dto;

import com.splitwise.domain.dailylog.DailyLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyLogResponse {

    private Long id;
    private LocalDate logDate;
    private BigDecimal morningWeight;

    // Notes
    private String activityNotes;
    private String nutritionNotes;
    private String feelingsNotes;

    // Sleep
    private BigDecimal sleepHours;
    private String sleepQuality;

    // Weather
    private BigDecimal weatherTemp;
    private Integer weatherHumidity;
    private String weatherConditions;

    // Nested data
    private List<MealResponse> meals;
    private List<WorkoutResponse> workouts;
    private Integer totalWaterMl;

    public static DailyLogResponse fromDailyLog(DailyLog log) {
        int totalWater = log.getWaterIntakes().stream()
                .mapToInt(w -> w.getAmountMl() != null ? w.getAmountMl() : 0)
                .sum();

        return DailyLogResponse.builder()
                .id(log.getId())
                .logDate(log.getLogDate())
                .morningWeight(log.getMorningWeight())
                .activityNotes(log.getActivityNotes())
                .nutritionNotes(log.getNutritionNotes())
                .feelingsNotes(log.getFeelingsNotes())
                .sleepHours(log.getSleepHours())
                .sleepQuality(log.getSleepQuality())
                .weatherTemp(log.getWeatherTemp())
                .weatherHumidity(log.getWeatherHumidity())
                .weatherConditions(log.getWeatherConditions())
                .meals(log.getMeals().stream().map(MealResponse::fromMeal).toList())
                .workouts(log.getWorkouts().stream().map(WorkoutResponse::fromWorkout).toList())
                .totalWaterMl(totalWater)
                .build();
    }
}
