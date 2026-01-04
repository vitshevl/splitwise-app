package com.splitwise.dailylog.dto;

import com.splitwise.domain.dailylog.BodyMeasurement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BodyMeasurementResponse {

    private Long id;
    private LocalDate measurementDate;
    private BigDecimal weight;
    private BigDecimal bodyFatPercentage;
    private BigDecimal muscleMass;
    private BigDecimal waistCm;
    private BigDecimal chestCm;
    private BigDecimal hipsCm;
    private String notes;

    public static BodyMeasurementResponse fromBodyMeasurement(BodyMeasurement measurement) {
        return BodyMeasurementResponse.builder()
                .id(measurement.getId())
                .measurementDate(measurement.getMeasurementDate())
                .weight(measurement.getWeight())
                .bodyFatPercentage(measurement.getBodyFatPercentage())
                .muscleMass(measurement.getMuscleMass())
                .waistCm(measurement.getWaistCm())
                .chestCm(measurement.getChestCm())
                .hipsCm(measurement.getHipsCm())
                .notes(measurement.getNotes())
                .build();
    }
}

