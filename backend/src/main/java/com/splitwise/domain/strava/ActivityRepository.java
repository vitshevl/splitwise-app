package com.splitwise.domain.strava;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Page<Activity> findByUserIdOrderByStartDateDesc(Long userId, Pageable pageable);

    List<Activity> findByUserIdAndStartDateBetweenOrderByStartDateDesc(
            Long userId, Instant startDate, Instant endDate);

    Optional<Activity> findByIdAndUserId(Long id, Long userId);

    Optional<Activity> findByStravaId(Long stravaId);

    @Query("SELECT a FROM Activity a WHERE a.user.id = :userId AND a.type = :type ORDER BY a.startDate DESC")
    Page<Activity> findByUserIdAndType(@Param("userId") Long userId, @Param("type") String type, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Activity a WHERE a.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(a.distance) FROM Activity a WHERE a.user.id = :userId")
    Optional<Double> sumDistanceByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(a.movingTime) FROM Activity a WHERE a.user.id = :userId")
    Optional<Long> sumMovingTimeByUserId(@Param("userId") Long userId);
}

