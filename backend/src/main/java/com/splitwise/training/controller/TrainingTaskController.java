package com.splitwise.training.controller;

import com.splitwise.domain.user.User;
import com.splitwise.training.dto.TrainingTaskRequest;
import com.splitwise.training.dto.TrainingTaskResponse;
import com.splitwise.training.service.TrainingTaskService;
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
@RequestMapping("/api/training-tasks")
@RequiredArgsConstructor
public class TrainingTaskController {

    private final TrainingTaskService trainingTaskService;

    @PostMapping
    public ResponseEntity<TrainingTaskResponse> createTask(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TrainingTaskRequest request) {
        return ResponseEntity.ok(trainingTaskService.createTask(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingTaskResponse> updateTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody TrainingTaskRequest request) {
        return ResponseEntity.ok(trainingTaskService.updateTask(user.getId(), id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TrainingTaskResponse> toggleComplete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(trainingTaskService.toggleComplete(user.getId(), id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingTaskResponse> getTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(trainingTaskService.getTask(user.getId(), id));
    }

    @GetMapping
    public ResponseEntity<Page<TrainingTaskResponse>> getTasks(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 50, sort = "taskDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(trainingTaskService.getTasks(user.getId(), pageable));
    }

    @GetMapping("/range")
    public ResponseEntity<List<TrainingTaskResponse>> getTasksByDateRange(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(trainingTaskService.getTasksByDateRange(user.getId(), startDate, endDate));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<TrainingTaskResponse>> getTasksByDate(
            @AuthenticationPrincipal User user,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(trainingTaskService.getTasksByDate(user.getId(), date));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<TrainingTaskResponse>> getPendingTasks(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(trainingTaskService.getPendingTasks(user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        trainingTaskService.deleteTask(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}

