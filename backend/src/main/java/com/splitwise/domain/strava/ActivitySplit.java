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
@Table(name = "activity_splits", schema = "strava_data")
public class ActivitySplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "split_index", nullable = false)
    private Integer splitIndex;

    @Column(precision = 12, scale = 2)
    private BigDecimal distance;

    @Column(name = "elapsed_time")
    private Integer elapsedTime;

    @Column(name = "moving_time")
    private Integer movingTime;

    @Column(name = "elevation_difference", precision = 10, scale = 2)
    private BigDecimal elevationDifference;

    @Column(name = "average_speed", precision = 8, scale = 4)
    private BigDecimal averageSpeed;

    @Column(name = "average_heartrate", precision = 5, scale = 2)
    private BigDecimal averageHeartrate;

    @Column(name = "pace_zone")
    private Integer paceZone;

    @Column(name = "is_metric")
    private Boolean isMetric;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}

