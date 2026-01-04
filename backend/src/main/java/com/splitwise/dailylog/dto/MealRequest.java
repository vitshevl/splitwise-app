package com.splitwise.dailylog.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class MealRequest {

    private LocalTime mealTime;
    private String mealType;
    private String description;
    private Integer calories;
    private BigDecimal proteinGrams;
    private BigDecimal carbsGrams;
    private BigDecimal fatGrams;
    private BigDecimal fiberGrams;
    private String notes;
}

