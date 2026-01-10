//package com.fitness.aiservice.controller;
//
//import com.fitness.aiservice.model.Recommendation;
//import com.fitness.aiservice.service.RecommendationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/recommendations")
//public class RecommendationController {
//    private final RecommendationService recommendationService;
//
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<Recommendation>> getUserRecommendation(@PathVariable String userId) {
//        return ResponseEntity.ok(recommendationService.getUserRecommendation(userId));
//    }
//
//    @GetMapping("/activity/{activityId}")
//    public ResponseEntity<Recommendation> getActivityRecommendation(@PathVariable String activityId) {
//        return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId));
//    }
//}
package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Slf4j
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendation(@PathVariable String activityId) {
        log.info("Fetching recommendation for activity: {}", activityId);

        try {
            Recommendation recommendation = recommendationService.getActivityRecommendation(activityId);

            if (recommendation == null) {
                log.info("Recommendation not found for activity: {}", activityId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            log.info("Recommendation found for activity: {}", activityId);
            return ResponseEntity.ok(recommendation);

        } catch (RuntimeException e) {
            log.warn("Recommendation not yet available for activity: {}", activityId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRecommendations(@PathVariable String userId) {
        log.info("Fetching recommendations for user: {}", userId);

        try {
            var recommendations = recommendationService.getUserRecommendations(userId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            log.error("Error fetching user recommendations: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching recommendations");
        }
    }
}
