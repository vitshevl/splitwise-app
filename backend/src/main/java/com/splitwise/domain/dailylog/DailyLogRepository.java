package com.splitwise.domain.dailylog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {

    Optional<DailyLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    Optional<DailyLog> findByIdAndUserId(Long id, Long userId);

    Page<DailyLog> findByUserIdOrderByLogDateDesc(Long userId, Pageable pageable);

    List<DailyLog> findByUserIdAndLogDateBetweenOrderByLogDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT dl FROM DailyLog dl WHERE dl.user.id = :userId ORDER BY dl.logDate DESC LIMIT 1")
    Optional<DailyLog> findLatestByUserId(@Param("userId") Long userId);

    boolean existsByUserIdAndLogDate(Long userId, LocalDate logDate);
}

