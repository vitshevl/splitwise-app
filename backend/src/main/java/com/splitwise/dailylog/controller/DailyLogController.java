package com.splitwise.dailylog.controller;

import com.splitwise.dailylog.dto.*;
import com.splitwise.dailylog.service.DailyLogService;
import com.splitwise.domain.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/daily-logs")
@RequiredArgsConstructor
public class DailyLogController {

    private final DailyLogService dailyLogService;

    // Daily Log endpoints
    @PostMapping
    public ResponseEntity<DailyLogResponse> createDailyLog(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DailyLogRequest request) {
        return ResponseEntity.ok(dailyLogService.createDailyLog(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DailyLogResponse> updateDailyLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody DailyLogRequest request) {
        return ResponseEntity.ok(dailyLogService.updateDailyLog(user.getId(), id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DailyLogResponse> getDailyLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(dailyLogService.getDailyLog(user.getId(), id));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<DailyLogResponse> getDailyLogByDate(
            @AuthenticationPrincipal User user,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(dailyLogService.getDailyLogByDate(user.getId(), date));
    }

    @GetMapping
    public ResponseEntity<Page<DailyLogResponse>> getDailyLogs(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "logDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(dailyLogService.getDailyLogs(user.getId(), pageable));
    }

    @GetMapping("/range")
    public ResponseEntity<List<DailyLogResponse>> getDailyLogsByDateRange(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dailyLogService.getDailyLogsByDateRange(user.getId(), startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDailyLog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        dailyLogService.deleteDailyLog(user.getId(), id);
        return ResponseEntity.noContent().build();
    }

    // Meal endpoints
    @PostMapping("/{logId}/meals")
    public ResponseEntity<MealResponse> addMeal(
            @AuthenticationPrincipal User user,
            @PathVariable Long logId,
            @Valid @RequestBody MealRequest request) {
        return ResponseEntity.ok(dailyLogService.addMeal(user.getId(), logId, request));
    }

    @PutMapping("/{logId}/meals/{mealId}")
    public ResponseEntity<MealResponse> updateMeal(
            @AuthenticationPrincipal User user,
            @PathVariable Long logId,
            @PathVariable Long mealId,
            @Valid @RequestBody MealRequest request) {
        return ResponseEntity.ok(dailyLogService.updateMeal(user.getId(), logId, mealId, request));
    }

    @DeleteMapping("/{logId}/meals/{mealId}")
    public ResponseEntity<Void> deleteMeal(
            @AuthenticationPrincipal User user,
            @PathVariable Long logId,
            @PathVariable Long mealId) {
        dailyLogService.deleteMeal(user.getId(), logId, mealId);
        return ResponseEntity.noContent().build();
    }

    // Workout endpoints
    @PostMapping("/{logId}/workouts")
    public ResponseEntity<WorkoutResponse> addWorkout(
            @AuthenticationPrincipal User user,
            @PathVariable Long logId,
            @Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(dailyLogService.addWorkout(user.getId(), logId, request));
    }

    @PutMapping("/{logId}/workouts/{workoutId}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @AuthenticationPrincipal User user,
            @PathVariable Long logId,
            @PathVariable Long workoutId,
            @Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(dailyLogService.updateWorkout(user.getId(), logId, workoutId, request));
    }

    @DeleteMapping("/{logId}/workouts/{workoutId}")
    public ResponseEntity<Void> deleteWorkout(
            @AuthenticationPrincipal User user,
            @PathVariable Long logId,
            @PathVariable Long workoutId) {
        dailyLogService.deleteWorkout(user.getId(), logId, workoutId);
        return ResponseEntity.noContent().build();
    }

    // Water intake endpoints
    @PostMapping("/{logId}/water")
    public ResponseEntity<Void> addWaterIntake(
            @AuthenticationPrincipal User user,
            @PathVariable Long logId,
            @Valid @RequestBody WaterIntakeRequest request) {
        dailyLogService.addWaterIntake(user.getId(), logId, request);
        return ResponseEntity.ok().build();
    }
}

