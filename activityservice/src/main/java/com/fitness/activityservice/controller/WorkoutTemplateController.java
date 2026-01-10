package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.CreateTemplateRequest;
import com.fitness.activityservice.model.WorkoutTemplate;
import com.fitness.activityservice.service.WorkoutTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class WorkoutTemplateController {
    private final WorkoutTemplateService templateService;

    @PostMapping
    public ResponseEntity<WorkoutTemplate> createTemplate(
            @RequestBody CreateTemplateRequest request,
            @RequestHeader("X-User-ID") String userId) {
        WorkoutTemplate template = templateService.createTemplate(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(template);
    }

    @GetMapping("/my")
    public ResponseEntity<List<WorkoutTemplate>> getMyTemplates(
            @RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(templateService.getMyTemplates(userId));
    }

    @GetMapping("/public")
    public ResponseEntity<List<WorkoutTemplate>> getPublicTemplates() {
        return ResponseEntity.ok(templateService.getPublicTemplates());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<WorkoutTemplate>> getTemplatesByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(templateService.getTemplatesByCategory(category));
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<WorkoutTemplate>> getTemplatesByDifficulty(
            @PathVariable String difficulty) {
        return ResponseEntity.ok(templateService.getTemplatesByDifficulty(difficulty));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutTemplate> getTemplate(@PathVariable String id) {
        return ResponseEntity.ok(templateService.getTemplateById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable String id,
            @RequestHeader("X-User-ID") String userId) {
        templateService.deleteTemplate(id, userId);
        return ResponseEntity.noContent().build();
    }
}
