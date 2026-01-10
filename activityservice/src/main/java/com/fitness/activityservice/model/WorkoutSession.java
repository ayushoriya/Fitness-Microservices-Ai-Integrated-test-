package com.fitness.activityservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "workout_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutSession {
    @Id
    private String id;

    private String userId;
    private String templateId;
    private String templateName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status; // IN_PROGRESS, COMPLETED, ABANDONED

    private List<ExerciseProgress> exerciseProgress;

    private Integer totalCaloriesBurned;
    private Integer totalDuration; // in minutes
}
