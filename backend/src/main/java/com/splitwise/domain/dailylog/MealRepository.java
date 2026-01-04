package com.splitwise.domain.dailylog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    List<Meal> findByDailyLogIdOrderByMealTimeAsc(Long dailyLogId);

    Optional<Meal> findByIdAndDailyLogId(Long id, Long dailyLogId);
}

