package com.fitness.activityservice.dto;

import lombok.Data;

@Data
public class CompleteExerciseRequest {
    private String sessionId;
    private String exerciseType;
    private Integer completedSets;
    private Integer completedReps;
}
