package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.CompleteExerciseRequest;
import com.fitness.activityservice.dto.StartWorkoutRequest;
import com.fitness.activityservice.model.*;
import com.fitness.activityservice.repository.WorkoutSessionRepository;
import com.fitness.activityservice.repository.WorkoutTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutSessionService {
    private final WorkoutSessionRepository sessionRepository;
    private final WorkoutTemplateRepository templateRepository;

    public WorkoutSession startWorkout(StartWorkoutRequest request, String userId) {
        // Check if user already has an active workout
        List<WorkoutSession> activeSessions = sessionRepository
                .findByUserIdAndStatus(userId, "IN_PROGRESS");

        if (!activeSessions.isEmpty()) {
            throw new RuntimeException("You already have an active workout. Complete or abandon it first.");
        }

        WorkoutTemplate template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Template not found"));

        // Initialize exercise progress
        List<ExerciseProgress> exerciseProgress = template.getExercises().stream()
                .map(ex -> ExerciseProgress.builder()
                        .exerciseType(ex.getExerciseType())
                        .targetSets(ex.getSets())
                        .completedSets(0)
                        .targetReps(ex.getReps())
                        .completedReps(0)
                        .isCompleted(false)
                        .build())
                .collect(Collectors.toList());

        WorkoutSession session = WorkoutSession.builder()
                .userId(userId)
                .templateId(template.getId())
                .templateName(template.getName())
                .startTime(LocalDateTime.now())
                .status("IN_PROGRESS")
                .exerciseProgress(exerciseProgress)
                .totalCaloriesBurned(0)
                .build();

        // Increment template usage count
        template.setTimesUsed(template.getTimesUsed() + 1);
        templateRepository.save(template);

        return sessionRepository.save(session);
    }

    public WorkoutSession getActiveWorkout(String userId) {
        return sessionRepository.findByUserIdAndStatus(userId, "IN_PROGRESS")
                .stream()
                .findFirst()
                .orElse(null);
    }

    public WorkoutSession completeExercise(CompleteExerciseRequest request) {
        WorkoutSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Update exercise progress
        session.getExerciseProgress().stream()
                .filter(ep -> ep.getExerciseType().equals(request.getExerciseType()))
                .findFirst()
                .ifPresent(ep -> {
                    ep.setCompletedSets(request.getCompletedSets());
                    ep.setCompletedReps(request.getCompletedReps());
                    ep.setIsCompleted(request.getCompletedSets().equals(ep.getTargetSets()));
                    if (ep.getIsCompleted()) {
                        ep.setCompletedAt(LocalDateTime.now());
                    }
                });

        return sessionRepository.save(session);
    }

    public WorkoutSession completeWorkout(String sessionId, String userId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        session.setEndTime(LocalDateTime.now());
        session.setStatus("COMPLETED");

        // Calculate total duration
        long duration = ChronoUnit.MINUTES.between(session.getStartTime(), session.getEndTime());
        session.setTotalDuration((int) duration);

        // Calculate total calories (rough estimate: 5 cal per minute)
        session.setTotalCaloriesBurned((int) (duration * 5));

        return sessionRepository.save(session);
    }

    public WorkoutSession abandonWorkout(String sessionId, String userId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        session.setEndTime(LocalDateTime.now());
        session.setStatus("ABANDONED");

        return sessionRepository.save(session);
    }

    public List<WorkoutSession> getWorkoutHistory(String userId) {
        return sessionRepository.findByUserId(userId)
                .stream()
                .filter(s -> s.getStatus().equals("COMPLETED"))
                .collect(Collectors.toList());
    }
}
