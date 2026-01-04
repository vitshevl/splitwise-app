package com.splitwise.training.dto;

import com.splitwise.domain.training.TrainingTask;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingTaskResponse {

    private Long id;
    private LocalDate taskDate;
    private String description;
    private Boolean isCompleted;
    private String notes;

    public static TrainingTaskResponse fromTrainingTask(TrainingTask task) {
        return TrainingTaskResponse.builder()
                .id(task.getId())
                .taskDate(task.getTaskDate())
                .description(task.getDescription())
                .isCompleted(task.getIsCompleted())
                .notes(task.getNotes())
                .build();
    }
}

