//package com.fitness.aiservice.service;
//
//import com.fitness.aiservice.model.Activity;
//import com.fitness.aiservice.model.Recommendation;
//import com.fitness.aiservice.repository.RecommendationRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Service;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class ActivityMessageListener {
//
//    private final ActivityAIService aiService;
//    private final RecommendationRepository recommendationRepository;
//
//    @RabbitListener(queues = "activity.queue")
//    public void processActivity(Activity activity) {
//        log.info("Received activity for processing: {}", activity.getId());
////        log.info("Generated Recommendation: {}", aiService.generateRecommendation(activity));
//        Recommendation recommendation = aiService.generateRecommendation(activity);
//        recommendationRepository.save(recommendation);
//    }
//}
package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListener {
    private final ActivityAIService activityAIService;
    private final RecommendationService recommendationService;  // ADD THIS

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());

        // Generate recommendation
        var recommendation = activityAIService.generateRecommendation(activity);

        // SAVE IT TO MONGODB
        recommendationService.save(recommendation);  // ADD THIS LINE

        log.info("Recommendation saved for activity: {}", activity.getId());
    }
}