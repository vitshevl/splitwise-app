package com.splitwise.domain.strava;

import com.splitwise.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "activities", schema = "strava_data")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "strava_id", unique = true)
    private Long stravaId;

    private String name;

    private String type;

    @Column(name = "sport_type")
    private String sportType;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "start_date_local")
    private Instant startDateLocal;

    private String timezone;

    @Column(precision = 12, scale = 2)
    private BigDecimal distance;

    @Column(name = "moving_time")
    private Integer movingTime;

    @Column(name = "elapsed_time")
    private Integer elapsedTime;

    @Column(name = "total_elevation_gain", precision = 10, scale = 2)
    private BigDecimal totalElevationGain;

    @Column(name = "elev_high", precision = 10, scale = 2)
    private BigDecimal elevHigh;

    @Column(name = "elev_low", precision = 10, scale = 2)
    private BigDecimal elevLow;

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

    @Column(name = "average_temp", precision = 5, scale = 2)
    private BigDecimal averageTemp;

    private Integer calories;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "device_name")
    private String deviceName;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ActivityLap> laps = new ArrayList<>();

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ActivitySplit> splits = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}

