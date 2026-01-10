package com.fitness.activityservice.controller;

import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
//@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities(
            @RequestHeader(value = "X-User-ID", required = false) String userId) {
        try {
            System.out.println("📋 GET /api/activities - User: " + userId);
            List<Activity> activities = activityService.getAllActivities(userId);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(
            @PathVariable String id,
            @RequestHeader(value = "X-User-ID", required = false) String userId) {
        try {
            System.out.println("🔍 GET /api/activities/" + id + " - User: " + userId);
            Activity activity = activityService.getActivityById(id, userId);
            return ResponseEntity.ok(activity);
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(
            @RequestBody Activity activity,
            @RequestHeader(value = "X-User-ID", required = false) String userId) {
        try {
            System.out.println("➕ POST /api/activities - User: " + userId);
            if (userId != null && !userId.isEmpty()) {
                activity.setUserId(userId);
            }
            Activity saved = activityService.saveActivity(activity);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(
            @PathVariable String id,
            @RequestBody Activity activity,
            @RequestHeader(value = "X-User-ID", required = false) String userId) {
        try {
            System.out.println("✏️ PUT /api/activities/" + id + " - User: " + userId);
            Activity updated = activityService.updateActivity(id, activity, userId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable String id,
            @RequestHeader(value = "X-User-ID", required = false) String userId) {
        try {
            System.out.println("🗑️ DELETE /api/activities/" + id + " - User: " + userId);
            activityService.deleteActivity(id, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
