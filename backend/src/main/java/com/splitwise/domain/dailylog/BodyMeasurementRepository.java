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
public interface BodyMeasurementRepository extends JpaRepository<BodyMeasurement, Long> {

    Page<BodyMeasurement> findByUserIdOrderByMeasurementDateDesc(Long userId, Pageable pageable);

    Optional<BodyMeasurement> findByIdAndUserId(Long id, Long userId);

    List<BodyMeasurement> findByUserIdAndMeasurementDateBetweenOrderByMeasurementDateAsc(
            Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT bm FROM BodyMeasurement bm WHERE bm.user.id = :userId ORDER BY bm.measurementDate DESC LIMIT 1")
    Optional<BodyMeasurement> findLatestByUserId(@Param("userId") Long userId);
}

