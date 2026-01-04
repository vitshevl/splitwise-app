package com.splitwise.domain.dailylog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    List<Workout> findByDailyLogIdOrderByWorkoutTimeAsc(Long dailyLogId);

    Optional<Workout> findByIdAndDailyLogId(Long id, Long dailyLogId);
}

