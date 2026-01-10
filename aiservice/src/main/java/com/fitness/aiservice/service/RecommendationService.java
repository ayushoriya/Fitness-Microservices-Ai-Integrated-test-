////package com.fitness.aiservice.service;
////
////import com.fitness.aiservice.model.Recommendation;
////import com.fitness.aiservice.repository.RecommendationRepository;
////import lombok.RequiredArgsConstructor;
////import org.springframework.stereotype.Service;
////
////import java.util.List;
////
////@Service
////@RequiredArgsConstructor
////public class RecommendationService {
////    private final RecommendationRepository recommendationRepository;
////
////    public List<Recommendation> getUserRecommendation(String userId) {
////        return recommendationRepository.findByUserId(userId);
////    }
////
////    public Recommendation getActivityRecommendation(String activityId) {
////        return recommendationRepository.findByActivityId(activityId)
////                .orElseThrow(() -> new RuntimeException("No recommendation found for this activity: " + activityId));
////    }
////}
package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;

    public Recommendation save(Recommendation recommendation) {  // ADD THIS METHOD
        return recommendationRepository.save(recommendation);
    }

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() -> new RuntimeException("No recommendation found for this activity: " + activityId));
    }

    public Object getUserRecommendations(String userId) {
        return recommendationRepository.findByUserId(userId);
    }
}

//
//
//package com.fitness.aiservice.service;
//
////import com.fitness.aiservice.dto.RecommendationResponse;
//import com.fitness.aiservice.model.Recommendation;
//import com.fitness.aiservice.repository.RecommendationRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class RecommendationService {
//
//    private final RecommendationRepository recommendationRepository;
//
//    public Recommendation getActivityRecommendation(String activityId) {
//        log.info("Looking for recommendation for activity: {}", activityId);
//
//        Recommendation recommendation = recommendationRepository.findByActivityId(activityId)
//                .orElse(null);
//
//        if (recommendation == null) {
//            log.info("No recommendation found for activity: {}", activityId);
//            return null;
//        }
//
//        return mapToResponse(recommendation);
//    }
//
//    public List<Recommendation> getUserRecommendations(String userId) {
//        return recommendationRepository.findByUserId(userId)
//                .stream()
//                .map(this::mapToResponse)
//                .collect(Collectors.toList());
//    }
//
//    private Recommendation mapToResponse(Recommendation recommendation) {
//        Recommendation response = new Recommendation();
//        response.setId(recommendation.getId());
//        response.setActivityId(recommendation.getActivityId());
//        response.setUserId(recommendation.getUserId());
//        response.setRecommendation(recommendation.getRecommendation());
//        response.setCreatedAt(recommendation.getCreatedAt());
//        return response;
//    }
//
//    public void save(Recommendation recommendation) {
//    }
//}
