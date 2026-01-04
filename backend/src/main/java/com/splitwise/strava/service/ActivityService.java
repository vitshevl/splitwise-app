package com.splitwise.strava.service;

import com.splitwise.domain.strava.Activity;
import com.splitwise.domain.strava.ActivityRepository;
import com.splitwise.strava.dto.ActivityDetailResponse;
import com.splitwise.strava.dto.ActivityResponse;
import com.splitwise.strava.dto.ActivityStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    @Transactional(readOnly = true)
    public Page<ActivityResponse> getActivities(Long userId, Pageable pageable) {
        return activityRepository.findByUserIdOrderByStartDateDesc(userId, pageable)
                .map(ActivityResponse::fromActivity);
    }

    @Transactional(readOnly = true)
    public Page<ActivityResponse> getActivitiesByType(Long userId, String type, Pageable pageable) {
        return activityRepository.findByUserIdAndType(userId, type, pageable)
                .map(ActivityResponse::fromActivity);
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByDateRange(Long userId, Instant startDate, Instant endDate) {
        return activityRepository.findByUserIdAndStartDateBetweenOrderByStartDateDesc(userId, startDate, endDate)
                .stream()
                .map(ActivityResponse::fromActivity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ActivityDetailResponse getActivityDetail(Long userId, Long activityId) {
        Activity activity = activityRepository.findByIdAndUserId(activityId, userId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        return ActivityDetailResponse.fromActivity(activity);
    }

    @Transactional(readOnly = true)
    public ActivityStatsResponse getActivityStats(Long userId) {
        long totalActivities = activityRepository.countByUserId(userId);
        Double totalDistanceMeters = activityRepository.sumDistanceByUserId(userId).orElse(0.0);
        Long totalDurationSeconds = activityRepository.sumMovingTimeByUserId(userId).orElse(0L);

        return ActivityStatsResponse.builder()
                .totalActivities(totalActivities)
                .totalDistanceMeters(totalDistanceMeters)
                .totalDurationSeconds(totalDurationSeconds)
                .totalDistance(formatDistance(totalDistanceMeters))
                .totalDuration(formatDuration(totalDurationSeconds))
                .build();
    }

    private String formatDistance(Double meters) {
        if (meters == null || meters == 0) return "0 km";
        double km = meters / 1000.0;
        return String.format("%.1f km", km);
    }

    private String formatDuration(Long seconds) {
        if (seconds == null || seconds == 0) return "0h 0m";
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        return String.format("%dh %dm", hours, minutes);
    }
}

