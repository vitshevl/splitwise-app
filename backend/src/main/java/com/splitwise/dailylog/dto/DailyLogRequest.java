package com.splitwise.dailylog.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DailyLogRequest {

    @NotNull(message = "Log date is required")
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
}
