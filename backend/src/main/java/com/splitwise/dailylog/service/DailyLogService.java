package com.splitwise.dailylog.service;

import com.splitwise.dailylog.dto.*;
import com.splitwise.domain.dailylog.*;
import com.splitwise.domain.strava.Activity;
import com.splitwise.domain.strava.ActivityRepository;
import com.splitwise.domain.user.User;
import com.splitwise.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;
    private final MealRepository mealRepository;
    private final WorkoutRepository workoutRepository;
    private final BodyMeasurementRepository bodyMeasurementRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    // Daily Log operations
    @Transactional
    public DailyLogResponse createDailyLog(Long userId, DailyLogRequest request) {
        if (dailyLogRepository.existsByUserIdAndLogDate(userId, request.getLogDate())) {
            throw new RuntimeException("Daily log already exists for this date");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DailyLog log = DailyLog.builder()
                .user(user)
                .logDate(request.getLogDate())
                .morningWeight(request.getMorningWeight())
                .activityNotes(request.getActivityNotes())
                .nutritionNotes(request.getNutritionNotes())
                .feelingsNotes(request.getFeelingsNotes())
                .sleepHours(request.getSleepHours())
                .sleepQuality(request.getSleepQuality())
                .weatherTemp(request.getWeatherTemp())
                .weatherHumidity(request.getWeatherHumidity())
                .weatherConditions(request.getWeatherConditions())
                .build();

        return DailyLogResponse.fromDailyLog(dailyLogRepository.save(log));
    }

    @Transactional
    public DailyLogResponse updateDailyLog(Long userId, Long logId, DailyLogRequest request) {
        DailyLog log = dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        log.setMorningWeight(request.getMorningWeight());
        log.setActivityNotes(request.getActivityNotes());
        log.setNutritionNotes(request.getNutritionNotes());
        log.setFeelingsNotes(request.getFeelingsNotes());
        log.setSleepHours(request.getSleepHours());
        log.setSleepQuality(request.getSleepQuality());
        log.setWeatherTemp(request.getWeatherTemp());
        log.setWeatherHumidity(request.getWeatherHumidity());
        log.setWeatherConditions(request.getWeatherConditions());

        return DailyLogResponse.fromDailyLog(dailyLogRepository.save(log));
    }

    @Transactional(readOnly = true)
    public DailyLogResponse getDailyLog(Long userId, Long logId) {
        DailyLog log = dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));
        return DailyLogResponse.fromDailyLog(log);
    }

    @Transactional(readOnly = true)
    public DailyLogResponse getDailyLogByDate(Long userId, LocalDate date) {
        DailyLog log = dailyLogRepository.findByUserIdAndLogDate(userId, date)
                .orElseThrow(() -> new RuntimeException("Daily log not found for this date"));
        return DailyLogResponse.fromDailyLog(log);
    }

    @Transactional(readOnly = true)
    public Page<DailyLogResponse> getDailyLogs(Long userId, Pageable pageable) {
        return dailyLogRepository.findByUserIdOrderByLogDateDesc(userId, pageable)
                .map(DailyLogResponse::fromDailyLog);
    }

    @Transactional(readOnly = true)
    public List<DailyLogResponse> getDailyLogsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return dailyLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startDate, endDate)
                .stream()
                .map(DailyLogResponse::fromDailyLog)
                .toList();
    }

    @Transactional
    public void deleteDailyLog(Long userId, Long logId) {
        DailyLog log = dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));
        dailyLogRepository.delete(log);
    }

    // Meal operations
    @Transactional
    public MealResponse addMeal(Long userId, Long logId, MealRequest request) {
        DailyLog log = dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        Meal meal = Meal.builder()
                .dailyLog(log)
                .mealTime(request.getMealTime())
                .mealType(request.getMealType())
                .description(request.getDescription())
                .calories(request.getCalories())
                .proteinGrams(request.getProteinGrams())
                .carbsGrams(request.getCarbsGrams())
                .fatGrams(request.getFatGrams())
                .fiberGrams(request.getFiberGrams())
                .notes(request.getNotes())
                .build();

        return MealResponse.fromMeal(mealRepository.save(meal));
    }

    @Transactional
    public MealResponse updateMeal(Long userId, Long logId, Long mealId, MealRequest request) {
        dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        Meal meal = mealRepository.findByIdAndDailyLogId(mealId, logId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        meal.setMealTime(request.getMealTime());
        meal.setMealType(request.getMealType());
        meal.setDescription(request.getDescription());
        meal.setCalories(request.getCalories());
        meal.setProteinGrams(request.getProteinGrams());
        meal.setCarbsGrams(request.getCarbsGrams());
        meal.setFatGrams(request.getFatGrams());
        meal.setFiberGrams(request.getFiberGrams());
        meal.setNotes(request.getNotes());

        return MealResponse.fromMeal(mealRepository.save(meal));
    }

    @Transactional
    public void deleteMeal(Long userId, Long logId, Long mealId) {
        dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        Meal meal = mealRepository.findByIdAndDailyLogId(mealId, logId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        mealRepository.delete(meal);
    }

    // Workout operations
    @Transactional
    public WorkoutResponse addWorkout(Long userId, Long logId, WorkoutRequest request) {
        DailyLog log = dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        Activity stravaActivity = null;
        if (request.getStravaActivityId() != null) {
            stravaActivity = activityRepository.findByIdAndUserId(request.getStravaActivityId(), userId)
                    .orElse(null);
        }

        Workout workout = Workout.builder()
                .dailyLog(log)
                .stravaActivity(stravaActivity)
                .workoutTime(request.getWorkoutTime())
                .workoutType(request.getWorkoutType())
                .durationMinutes(request.getDurationMinutes())
                .caloriesBurned(request.getCaloriesBurned())
                .distanceKm(request.getDistanceKm())
                .avgPaceSeconds(request.getAvgPaceSeconds())
                .avgHeartrate(request.getAvgHeartrate())
                .maxHeartrate(request.getMaxHeartrate())
                .exercises(request.getExercises())
                .setsReps(request.getSetsReps())
                .notes(request.getNotes())
                .analysis(request.getAnalysis())
                .build();

        return WorkoutResponse.fromWorkout(workoutRepository.save(workout));
    }

    @Transactional
    public WorkoutResponse updateWorkout(Long userId, Long logId, Long workoutId, WorkoutRequest request) {
        dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        Workout workout = workoutRepository.findByIdAndDailyLogId(workoutId, logId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        Activity stravaActivity = null;
        if (request.getStravaActivityId() != null) {
            stravaActivity = activityRepository.findByIdAndUserId(request.getStravaActivityId(), userId)
                    .orElse(null);
        }

        workout.setStravaActivity(stravaActivity);
        workout.setWorkoutTime(request.getWorkoutTime());
        workout.setWorkoutType(request.getWorkoutType());
        workout.setDurationMinutes(request.getDurationMinutes());
        workout.setCaloriesBurned(request.getCaloriesBurned());
        workout.setDistanceKm(request.getDistanceKm());
        workout.setAvgPaceSeconds(request.getAvgPaceSeconds());
        workout.setAvgHeartrate(request.getAvgHeartrate());
        workout.setMaxHeartrate(request.getMaxHeartrate());
        workout.setExercises(request.getExercises());
        workout.setSetsReps(request.getSetsReps());
        workout.setNotes(request.getNotes());
        workout.setAnalysis(request.getAnalysis());

        return WorkoutResponse.fromWorkout(workoutRepository.save(workout));
    }

    @Transactional
    public void deleteWorkout(Long userId, Long logId, Long workoutId) {
        dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        Workout workout = workoutRepository.findByIdAndDailyLogId(workoutId, logId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        workoutRepository.delete(workout);
    }

    // Water intake operations
    @Transactional
    public void addWaterIntake(Long userId, Long logId, WaterIntakeRequest request) {
        DailyLog log = dailyLogRepository.findByIdAndUserId(logId, userId)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        WaterIntake water = WaterIntake.builder()
                .dailyLog(log)
                .amountMl(request.getAmountMl())
                .intakeTime(request.getIntakeTime())
                .build();

        log.getWaterIntakes().add(water);
        dailyLogRepository.save(log);
    }

    // Body Measurement operations
    @Transactional
    public BodyMeasurementResponse createBodyMeasurement(Long userId, BodyMeasurementRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BodyMeasurement measurement = BodyMeasurement.builder()
                .user(user)
                .measurementDate(request.getMeasurementDate())
                .weight(request.getWeight())
                .bodyFatPercentage(request.getBodyFatPercentage())
                .muscleMass(request.getMuscleMass())
                .waistCm(request.getWaistCm())
                .chestCm(request.getChestCm())
                .hipsCm(request.getHipsCm())
                .notes(request.getNotes())
                .build();

        return BodyMeasurementResponse.fromBodyMeasurement(bodyMeasurementRepository.save(measurement));
    }

    @Transactional
    public BodyMeasurementResponse updateBodyMeasurement(Long userId, Long measurementId, BodyMeasurementRequest request) {
        BodyMeasurement measurement = bodyMeasurementRepository.findByIdAndUserId(measurementId, userId)
                .orElseThrow(() -> new RuntimeException("Body measurement not found"));

        measurement.setMeasurementDate(request.getMeasurementDate());
        measurement.setWeight(request.getWeight());
        measurement.setBodyFatPercentage(request.getBodyFatPercentage());
        measurement.setMuscleMass(request.getMuscleMass());
        measurement.setWaistCm(request.getWaistCm());
        measurement.setChestCm(request.getChestCm());
        measurement.setHipsCm(request.getHipsCm());
        measurement.setNotes(request.getNotes());

        return BodyMeasurementResponse.fromBodyMeasurement(bodyMeasurementRepository.save(measurement));
    }

    @Transactional(readOnly = true)
    public Page<BodyMeasurementResponse> getBodyMeasurements(Long userId, Pageable pageable) {
        return bodyMeasurementRepository.findByUserIdOrderByMeasurementDateDesc(userId, pageable)
                .map(BodyMeasurementResponse::fromBodyMeasurement);
    }

    @Transactional(readOnly = true)
    public List<BodyMeasurementResponse> getBodyMeasurementsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return bodyMeasurementRepository.findByUserIdAndMeasurementDateBetweenOrderByMeasurementDateAsc(userId, startDate, endDate)
                .stream()
                .map(BodyMeasurementResponse::fromBodyMeasurement)
                .toList();
    }

    @Transactional
    public void deleteBodyMeasurement(Long userId, Long measurementId) {
        BodyMeasurement measurement = bodyMeasurementRepository.findByIdAndUserId(measurementId, userId)
                .orElseThrow(() -> new RuntimeException("Body measurement not found"));
        bodyMeasurementRepository.delete(measurement);
    }
}
