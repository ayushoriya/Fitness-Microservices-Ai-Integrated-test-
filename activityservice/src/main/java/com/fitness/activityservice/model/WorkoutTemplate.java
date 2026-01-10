package com.fitness.activityservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "workout_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutTemplate {
    @Id
    private String id;

    private String name;
    private String description;
    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED
    private String category; // STRENGTH, CARDIO, HIIT, FLEXIBILITY, FULL_BODY
    private Integer estimatedDuration; // in minutes
    private String createdBy; // userId
    private Boolean isPublic; // public templates visible to all
    private Integer timesUsed;

    private List<TemplateExercise> exercises;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
