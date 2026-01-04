package com.splitwise.dailylog.dto;

import com.splitwise.domain.dailylog.Meal;
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
public class MealResponse {

    private Long id;
    private LocalTime mealTime;
    private String mealType;
    private String description;
    private Integer calories;
    private BigDecimal proteinGrams;
    private BigDecimal carbsGrams;
    private BigDecimal fatGrams;
    private BigDecimal fiberGrams;
    private String notes;

    public static MealResponse fromMeal(Meal meal) {
        return MealResponse.builder()
                .id(meal.getId())
                .mealTime(meal.getMealTime())
                .mealType(meal.getMealType())
                .description(meal.getDescription())
                .calories(meal.getCalories())
                .proteinGrams(meal.getProteinGrams())
                .carbsGrams(meal.getCarbsGrams())
                .fatGrams(meal.getFatGrams())
                .fiberGrams(meal.getFiberGrams())
                .notes(meal.getNotes())
                .build();
    }
}

