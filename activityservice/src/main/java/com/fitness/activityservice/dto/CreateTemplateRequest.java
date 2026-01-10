package com.fitness.activityservice.dto;

import com.fitness.activityservice.model.TemplateExercise;
import lombok.Data;

import java.util.List;

@Data
public class CreateTemplateRequest {
    private String name;
    private String description;
    private String difficulty;
    private String category;
    private Boolean isPublic;
    private List<TemplateExercise> exercises;
}
