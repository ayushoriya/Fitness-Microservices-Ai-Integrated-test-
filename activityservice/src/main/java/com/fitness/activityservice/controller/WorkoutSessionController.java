package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.CompleteExerciseRequest;
import com.fitness.activityservice.dto.StartWorkoutRequest;
import com.fitness.activityservice.model.WorkoutSession;
import com.fitness.activityservice.service.WorkoutSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout-sessions")
@RequiredArgsConstructor
public class WorkoutSessionController {
    private final WorkoutSessionService sessionService;

    @PostMapping("/start")
    public ResponseEntity<WorkoutSession> startWorkout(
            @RequestBody StartWorkoutRequest request,
            @RequestHeader("X-User-ID") String userId) {
        WorkoutSession session = sessionService.startWorkout(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping("/active")
    public ResponseEntity<WorkoutSession> getActiveWorkout(
            @RequestHeader("X-User-ID") String userId) {
        WorkoutSession session = sessionService.getActiveWorkout(userId);
        return session != null
                ? ResponseEntity.ok(session)
                : ResponseEntity.noContent().build();
    }

    @PutMapping("/exercise/complete")
    public ResponseEntity<WorkoutSession> completeExercise(
            @RequestBody CompleteExerciseRequest request) {
        WorkoutSession session = sessionService.completeExercise(request);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/{sessionId}/complete")
    public ResponseEntity<WorkoutSession> completeWorkout(
            @PathVariable String sessionId,
            @RequestHeader("X-User-ID") String userId) {
        WorkoutSession session = sessionService.completeWorkout(sessionId, userId);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/{sessionId}/abandon")
    public ResponseEntity<WorkoutSession> abandonWorkout(
            @PathVariable String sessionId,
            @RequestHeader("X-User-ID") String userId) {
        WorkoutSession session = sessionService.abandonWorkout(sessionId, userId);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/history")
    public ResponseEntity<List<WorkoutSession>> getWorkoutHistory(
            @RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(sessionService.getWorkoutHistory(userId));
    }
}
