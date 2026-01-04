package com.splitwise.strava.controller;

import com.splitwise.domain.user.User;
import com.splitwise.strava.dto.ActivityDetailResponse;
import com.splitwise.strava.dto.ActivityResponse;
import com.splitwise.strava.dto.ActivityStatsResponse;
import com.splitwise.strava.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<Page<ActivityResponse>> getActivities(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String type,
            @PageableDefault(size = 20, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<ActivityResponse> activities;
        if (type != null && !type.isBlank()) {
            activities = activityService.getActivitiesByType(user.getId(), type, pageable);
        } else {
            activities = activityService.getActivities(user.getId(), pageable);
        }
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/range")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByDateRange(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {
        
        return ResponseEntity.ok(
                activityService.getActivitiesByDateRange(user.getId(), startDate, endDate));
    }

    @GetMapping("/stats")
    public ResponseEntity<ActivityStatsResponse> getActivityStats(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(activityService.getActivityStats(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDetailResponse> getActivityDetail(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivityDetail(user.getId(), id));
    }
}

