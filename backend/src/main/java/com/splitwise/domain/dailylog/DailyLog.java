package com.splitwise.domain.dailylog;

import com.splitwise.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "daily_logs", schema = "daily_activities_log",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "log_date"}))
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "morning_weight", precision = 5, scale = 2)
    private BigDecimal morningWeight;

    // Notes
    @Column(name = "activity_notes", columnDefinition = "TEXT")
    private String activityNotes;

    @Column(name = "nutrition_notes", columnDefinition = "TEXT")
    private String nutritionNotes;

    @Column(name = "feelings_notes", columnDefinition = "TEXT")
    private String feelingsNotes;

    // Sleep
    @Column(name = "sleep_hours", precision = 4, scale = 2)
    private BigDecimal sleepHours;

    @Column(name = "sleep_quality")
    private String sleepQuality;

    // Weather
    @Column(name = "weather_temp", precision = 5, scale = 2)
    private BigDecimal weatherTemp;

    @Column(name = "weather_humidity")
    private Integer weatherHumidity;

    @Column(name = "weather_conditions")
    private String weatherConditions;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "dailyLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Meal> meals = new ArrayList<>();

    @OneToMany(mappedBy = "dailyLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Workout> workouts = new ArrayList<>();

    @OneToMany(mappedBy = "dailyLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WaterIntake> waterIntakes = new ArrayList<>();

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
