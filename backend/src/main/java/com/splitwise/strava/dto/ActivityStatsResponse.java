package com.splitwise.strava.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityStatsResponse {

    private long totalActivities;
    private String totalDistance;
    private String totalDuration;
    private Double totalDistanceMeters;
    private Long totalDurationSeconds;
}

