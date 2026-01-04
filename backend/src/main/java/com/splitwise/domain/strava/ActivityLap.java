package com.splitwise.domain.strava;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "activity_laps", schema = "strava_data")
public class ActivityLap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "strava_lap_id")
    private Long stravaLapId;

    private String name;

    @Column(name = "lap_index")
    private Integer lapIndex;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal distance;

    @Column(name = "moving_time")
    private Integer movingTime;

    @Column(name = "elapsed_time")
    private Integer elapsedTime;

    @Column(name = "total_elevation_gain", precision = 10, scale = 2)
    private BigDecimal totalElevationGain;

    @Column(name = "average_speed", precision = 8, scale = 4)
    private BigDecimal averageSpeed;

    @Column(name = "max_speed", precision = 8, scale = 4)
    private BigDecimal maxSpeed;

    @Column(name = "average_heartrate", precision = 5, scale = 2)
    private BigDecimal averageHeartrate;

    @Column(name = "max_heartrate")
    private Integer maxHeartrate;

    @Column(name = "average_cadence", precision = 6, scale = 2)
    private BigDecimal averageCadence;

    @Column(name = "pace_zone")
    private Integer paceZone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}

