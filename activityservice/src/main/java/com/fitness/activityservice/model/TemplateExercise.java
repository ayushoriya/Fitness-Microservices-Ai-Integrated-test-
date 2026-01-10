package com.fitness.activityservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateExercise {
    private String exerciseType; // PUSH_UP, SQUATS, etc.
    private Integer sets;
    private Integer reps;
    private Integer restSeconds; // rest after this exercise
    private String notes; // optional instructions
    private Integer orderIndex; // sequence in workout
}
