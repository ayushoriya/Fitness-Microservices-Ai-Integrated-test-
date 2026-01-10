package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.CreateTemplateRequest;
import com.fitness.activityservice.model.WorkoutTemplate;
import com.fitness.activityservice.repository.WorkoutTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutTemplateService {
    private final WorkoutTemplateRepository templateRepository;

    public WorkoutTemplate createTemplate(CreateTemplateRequest request, String userId) {
        // Calculate estimated duration
        int estimatedDuration = request.getExercises().stream()
                .mapToInt(ex -> {
                    int workTime = ex.getSets() * ex.getReps() * 3; // 3 sec per rep
                    int restTime = ex.getRestSeconds() != null ? ex.getRestSeconds() : 60;
                    return (workTime + restTime * (ex.getSets() - 1)) / 60;
                })
                .sum();

        WorkoutTemplate template = WorkoutTemplate.builder()
                .name(request.getName())
                .description(request.getDescription())
                .difficulty(request.getDifficulty())
                .category(request.getCategory())
                .estimatedDuration(estimatedDuration)
                .createdBy(userId)
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .timesUsed(0)
                .exercises(request.getExercises())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return templateRepository.save(template);
    }

    public List<WorkoutTemplate> getMyTemplates(String userId) {
        return templateRepository.findByCreatedBy(userId);
    }

    public List<WorkoutTemplate> getPublicTemplates() {
        return templateRepository.findByIsPublicTrue();
    }

    public List<WorkoutTemplate> getTemplatesByCategory(String category) {
        return templateRepository.findByCategory(category);
    }

    public List<WorkoutTemplate> getTemplatesByDifficulty(String difficulty) {
        return templateRepository.findByDifficulty(difficulty);
    }

    public WorkoutTemplate getTemplateById(String id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
    }

    public void deleteTemplate(String id, String userId) {
        WorkoutTemplate template = getTemplateById(id);
        if (!template.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this template");
        }
        templateRepository.delete(template);
    }
}
