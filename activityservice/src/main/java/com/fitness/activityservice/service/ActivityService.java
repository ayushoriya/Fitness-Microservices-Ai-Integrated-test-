package com.fitness.activityservice.service;

import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public List<Activity> getAllActivities(String userId) {
        System.out.println("📋 Getting all activities for user: " + userId);
        if (userId != null && !userId.isEmpty()) {
            return activityRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return activityRepository.findAll();
    }

    public Activity getActivityById(String id, String userId) {
        System.out.println("🔍 Getting activity by ID: " + id);
        Optional<Activity> activityOpt = activityRepository.findById(id);

        if (activityOpt.isEmpty()) {
            throw new RuntimeException("Activity not found");
        }

        Activity activity = activityOpt.get();
        if (userId != null && !userId.isEmpty()) {
            if (!activity.getUserId().equals(userId)) {
                throw new RuntimeException("Access denied");
            }
        }
        return activity;
    }

    public Activity saveActivity(Activity activity) {
        System.out.println("💾 Saving activity: " + activity.getType());

        if (activity.getCreatedAt() == null) {
            activity.setCreatedAt(LocalDateTime.now());
        }

        Activity saved = activityRepository.save(activity);
        System.out.println("✅ Activity saved with ID: " + saved.getId());

        // ✅ SEND RABBITMQ MESSAGE
        try {
            System.out.println("📤 Sending RabbitMQ message...");
            System.out.println("   Exchange: " + exchange);
            System.out.println("   Routing Key: " + routingKey);

            rabbitTemplate.convertAndSend(exchange, routingKey, saved);

            System.out.println("✅ Message sent successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to send RabbitMQ message: " + e.getMessage());
            e.printStackTrace();
        }

        return saved;
    }

    public void deleteActivity(String id, String userId) {
        Activity activity = getActivityById(id, userId);
        activityRepository.deleteById(id);
    }

    public Activity updateActivity(String id, Activity updatedActivity, String userId) {
        Activity existing = getActivityById(id, userId);
        existing.setType(updatedActivity.getType());
        existing.setDuration(updatedActivity.getDuration());
        existing.setCaloriesBurned(updatedActivity.getCaloriesBurned());
        existing.setNotes(updatedActivity.getNotes());
        return activityRepository.save(existing);
    }
}
