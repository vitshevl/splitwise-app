package com.splitwise.training.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TrainingTaskRequest {

    @NotNull(message = "Task date is required")
    private LocalDate taskDate;

    @NotBlank(message = "Description is required")
    private String description;

    private Boolean isCompleted;

    private String notes;
}

