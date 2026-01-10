package com.fitness.activityservice.repository;

import com.fitness.activityservice.model.WorkoutTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutTemplateRepository extends MongoRepository<WorkoutTemplate, String> {
    List<WorkoutTemplate> findByCreatedBy(String userId);
    List<WorkoutTemplate> findByIsPublicTrue();
    List<WorkoutTemplate> findByCategory(String category);
    List<WorkoutTemplate> findByDifficulty(String difficulty);
}
