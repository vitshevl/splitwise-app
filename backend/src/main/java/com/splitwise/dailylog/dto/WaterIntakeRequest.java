package com.splitwise.dailylog.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalTime;

@Data
public class WaterIntakeRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Integer amountMl;

    private LocalTime intakeTime;
}

