package com.splitwise.training.service;

import com.splitwise.domain.training.TrainingTask;
import com.splitwise.domain.training.TrainingTaskRepository;
import com.splitwise.domain.user.User;
import com.splitwise.domain.user.UserRepository;
import com.splitwise.training.dto.TrainingTaskRequest;
import com.splitwise.training.dto.TrainingTaskResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainingTaskService {

    private final TrainingTaskRepository trainingTaskRepository;
    private final UserRepository userRepository;

    @Transactional
    public TrainingTaskResponse createTask(Long userId, TrainingTaskRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainingTask task = TrainingTask.builder()
                .user(user)
                .taskDate(request.getTaskDate())
                .description(request.getDescription())
                .isCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : false)
                .notes(request.getNotes())
                .build();

        return TrainingTaskResponse.fromTrainingTask(trainingTaskRepository.save(task));
    }

    @Transactional
    public TrainingTaskResponse updateTask(Long userId, Long taskId, TrainingTaskRequest request) {
        TrainingTask task = trainingTaskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Training task not found"));

        task.setTaskDate(request.getTaskDate());
        task.setDescription(request.getDescription());
        task.setIsCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : task.getIsCompleted());
        task.setNotes(request.getNotes());

        return TrainingTaskResponse.fromTrainingTask(trainingTaskRepository.save(task));
    }

    @Transactional
    public TrainingTaskResponse toggleComplete(Long userId, Long taskId) {
        TrainingTask task = trainingTaskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Training task not found"));

        task.setIsCompleted(!task.getIsCompleted());

        return TrainingTaskResponse.fromTrainingTask(trainingTaskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public TrainingTaskResponse getTask(Long userId, Long taskId) {
        TrainingTask task = trainingTaskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Training task not found"));
        return TrainingTaskResponse.fromTrainingTask(task);
    }

    @Transactional(readOnly = true)
    public Page<TrainingTaskResponse> getTasks(Long userId, Pageable pageable) {
        return trainingTaskRepository.findByUserIdOrderByTaskDateDesc(userId, pageable)
                .map(TrainingTaskResponse::fromTrainingTask);
    }

    @Transactional(readOnly = true)
    public List<TrainingTaskResponse> getTasksByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return trainingTaskRepository.findByUserIdAndTaskDateBetweenOrderByTaskDateAsc(userId, startDate, endDate)
                .stream()
                .map(TrainingTaskResponse::fromTrainingTask)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TrainingTaskResponse> getTasksByDate(Long userId, LocalDate date) {
        return trainingTaskRepository.findByUserIdAndTaskDateOrderByCreatedAtAsc(userId, date)
                .stream()
                .map(TrainingTaskResponse::fromTrainingTask)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TrainingTaskResponse> getPendingTasks(Long userId) {
        return trainingTaskRepository.findByUserIdAndIsCompletedFalseOrderByTaskDateAsc(userId)
                .stream()
                .map(TrainingTaskResponse::fromTrainingTask)
                .toList();
    }

    @Transactional
    public void deleteTask(Long userId, Long taskId) {
        TrainingTask task = trainingTaskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Training task not found"));
        trainingTaskRepository.delete(task);
    }
}

