package com.splitwise.strava.dto;

import com.splitwise.domain.strava.Activity;
import com.splitwise.domain.strava.ActivityLap;
import com.splitwise.domain.strava.ActivitySplit;
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
public class ActivityDetailResponse {

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
    
    private String formattedPace;
    private String formattedDuration;
    private String formattedDistance;
    
    private List<LapResponse> laps;
    private List<SplitResponse> splits;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LapResponse {
        private Long id;
        private Integer lapIndex;
        private String name;
        private BigDecimal distance;
        private Integer movingTime;
        private Integer elapsedTime;
        private BigDecimal totalElevationGain;
        private BigDecimal averageSpeed;
        private BigDecimal averageHeartrate;
        private Integer maxHeartrate;
        private String formattedPace;
        private String formattedDuration;

        public static LapResponse fromLap(ActivityLap lap) {
            return LapResponse.builder()
                    .id(lap.getId())
                    .lapIndex(lap.getLapIndex())
                    .name(lap.getName())
                    .distance(lap.getDistance())
                    .movingTime(lap.getMovingTime())
                    .elapsedTime(lap.getElapsedTime())
                    .totalElevationGain(lap.getTotalElevationGain())
                    .averageSpeed(lap.getAverageSpeed())
                    .averageHeartrate(lap.getAverageHeartrate())
                    .maxHeartrate(lap.getMaxHeartrate())
                    .formattedPace(formatPace(lap.getAverageSpeed()))
                    .formattedDuration(formatDuration(lap.getMovingTime()))
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SplitResponse {
        private Long id;
        private Integer splitIndex;
        private BigDecimal distance;
        private Integer movingTime;
        private Integer elapsedTime;
        private BigDecimal elevationDifference;
        private BigDecimal averageSpeed;
        private BigDecimal averageHeartrate;
        private Integer paceZone;
        private Boolean isMetric;
        private String formattedPace;
        private String formattedDuration;

        public static SplitResponse fromSplit(ActivitySplit split) {
            return SplitResponse.builder()
                    .id(split.getId())
                    .splitIndex(split.getSplitIndex())
                    .distance(split.getDistance())
                    .movingTime(split.getMovingTime())
                    .elapsedTime(split.getElapsedTime())
                    .elevationDifference(split.getElevationDifference())
                    .averageSpeed(split.getAverageSpeed())
                    .averageHeartrate(split.getAverageHeartrate())
                    .paceZone(split.getPaceZone())
                    .isMetric(split.getIsMetric())
                    .formattedPace(formatPace(split.getAverageSpeed()))
                    .formattedDuration(formatDuration(split.getMovingTime()))
                    .build();
        }
    }

    public static ActivityDetailResponse fromActivity(Activity activity) {
        return ActivityDetailResponse.builder()
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
                .laps(activity.getLaps().stream()
                        .map(LapResponse::fromLap)
                        .toList())
                .splits(activity.getSplits().stream()
                        .map(SplitResponse::fromSplit)
                        .toList())
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

