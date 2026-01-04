package com.splitwise.dailylog.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BodyMeasurementRequest {

    @NotNull(message = "Measurement date is required")
    private LocalDate measurementDate;

    private BigDecimal weight;
    private BigDecimal bodyFatPercentage;
    private BigDecimal muscleMass;
    private BigDecimal waistCm;
    private BigDecimal chestCm;
    private BigDecimal hipsCm;
    private String notes;
}

