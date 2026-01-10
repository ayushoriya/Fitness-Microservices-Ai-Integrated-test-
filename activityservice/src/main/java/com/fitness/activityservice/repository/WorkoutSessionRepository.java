package com.fitness.activityservice.repository;

import com.fitness.activityservice.model.WorkoutSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutSessionRepository extends MongoRepository<WorkoutSession, String> {
    List<WorkoutSession> findByUserId(String userId);
    List<WorkoutSession> findByUserIdAndStatus(String userId, String status);
}
