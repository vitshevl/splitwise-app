package com.splitwise.dailylog.controller;

import com.splitwise.dailylog.dto.BodyMeasurementRequest;
import com.splitwise.dailylog.dto.BodyMeasurementResponse;
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
@RequestMapping("/api/body-measurements")
@RequiredArgsConstructor
public class BodyMeasurementController {

    private final DailyLogService dailyLogService;

    @PostMapping
    public ResponseEntity<BodyMeasurementResponse> createBodyMeasurement(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BodyMeasurementRequest request) {
        return ResponseEntity.ok(dailyLogService.createBodyMeasurement(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BodyMeasurementResponse> updateBodyMeasurement(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody BodyMeasurementRequest request) {
        return ResponseEntity.ok(dailyLogService.updateBodyMeasurement(user.getId(), id, request));
    }

    @GetMapping
    public ResponseEntity<Page<BodyMeasurementResponse>> getBodyMeasurements(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "measurementDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(dailyLogService.getBodyMeasurements(user.getId(), pageable));
    }

    @GetMapping("/range")
    public ResponseEntity<List<BodyMeasurementResponse>> getBodyMeasurementsByDateRange(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dailyLogService.getBodyMeasurementsByDateRange(user.getId(), startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBodyMeasurement(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        dailyLogService.deleteBodyMeasurement(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}

