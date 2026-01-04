package com.splitwise.domain.training;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingTaskRepository extends JpaRepository<TrainingTask, Long> {

    Page<TrainingTask> findByUserIdOrderByTaskDateDesc(Long userId, Pageable pageable);

    List<TrainingTask> findByUserIdAndTaskDateBetweenOrderByTaskDateAsc(
            Long userId, LocalDate startDate, LocalDate endDate);

    List<TrainingTask> findByUserIdAndTaskDateOrderByCreatedAtAsc(Long userId, LocalDate taskDate);

    Optional<TrainingTask> findByIdAndUserId(Long id, Long userId);

    List<TrainingTask> findByUserIdAndIsCompletedFalseOrderByTaskDateAsc(Long userId);
}

