package com.fitness.activityservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseProgress {
    private String exerciseType;
    private Integer targetSets;
    private Integer completedSets;
    private Integer targetReps;
    private Integer completedReps;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
}
