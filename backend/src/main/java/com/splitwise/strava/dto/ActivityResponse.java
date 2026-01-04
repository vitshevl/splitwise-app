package com.splitwise.strava.dto;

import com.splitwise.domain.strava.Activity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {

    private Long id;
    private Long stravaId;
    private String name;
    private String type;
    private String sportType;
    private Instant startDate;
    private Instant startDateLocal;
    private String timezone;
    private BigDecimal distance;
    private Integer movingTime;
    private Integer elapsedTime;
    private BigDecimal totalElevationGain;
    private BigDecimal elevHigh;
    private BigDecimal elevLow;
    private BigDecimal averageSpeed;
    private BigDecimal maxSpeed;
    private BigDecimal averageHeartrate;
    private Integer maxHeartrate;
    private BigDecimal averageCadence;
    private BigDecimal averageTemp;
    private Integer calories;
    private String description;
    private String deviceName;
    
    // Computed fields
    private String formattedPace;
    private String formattedDuration;
    private String formattedDistance;

    public static ActivityResponse fromActivity(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .stravaId(activity.getStravaId())
                .name(activity.getName())
                .type(activity.getType())
                .sportType(activity.getSportType())
                .startDate(activity.getStartDate())
                .startDateLocal(activity.getStartDateLocal())
                .timezone(activity.getTimezone())
                .distance(activity.getDistance())
                .movingTime(activity.getMovingTime())
                .elapsedTime(activity.getElapsedTime())
                .totalElevationGain(activity.getTotalElevationGain())
                .elevHigh(activity.getElevHigh())
                .elevLow(activity.getElevLow())
                .averageSpeed(activity.getAverageSpeed())
                .maxSpeed(activity.getMaxSpeed())
                .averageHeartrate(activity.getAverageHeartrate())
                .maxHeartrate(activity.getMaxHeartrate())
                .averageCadence(activity.getAverageCadence())
                .averageTemp(activity.getAverageTemp())
                .calories(activity.getCalories())
                .description(activity.getDescription())
                .deviceName(activity.getDeviceName())
                .formattedPace(formatPace(activity.getAverageSpeed()))
                .formattedDuration(formatDuration(activity.getMovingTime()))
                .formattedDistance(formatDistance(activity.getDistance()))
                .build();
    }

    private static String formatPace(BigDecimal speedMs) {
        if (speedMs == null || speedMs.doubleValue() == 0) return "--:--";
        double paceSecondsPerKm = 1000.0 / speedMs.doubleValue();
        int minutes = (int) (paceSecondsPerKm / 60);
        int seconds = (int) (paceSecondsPerKm % 60);
        return String.format("%d:%02d /km", minutes, seconds);
    }

    private static String formatDuration(Integer seconds) {
        if (seconds == null) return "--:--";
        int hours = seconds / 3600;
        int mins = (seconds % 3600) / 60;
        int secs = seconds % 60;
        if (hours > 0) {
            return String.format("%d:%02d:%02d", hours, mins, secs);
        }
        return String.format("%d:%02d", mins, secs);
    }

    private static String formatDistance(BigDecimal meters) {
        if (meters == null) return "0 km";
        double km = meters.doubleValue() / 1000.0;
        return String.format("%.2f km", km);
    }
}

