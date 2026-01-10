package com.fitness.activityservice.config;

import com.fitness.activityservice.model.TemplateExercise;
import com.fitness.activityservice.model.WorkoutTemplate;
import com.fitness.activityservice.repository.WorkoutTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PreBuiltTemplates implements CommandLineRunner {
    private final WorkoutTemplateRepository templateRepository;

    @Override
    public void run(String... args) {
        if (templateRepository.count() == 0) {
            log.info("Creating pre-built workout templates...");

            // Beginner Push Workout
            WorkoutTemplate beginnerPush = WorkoutTemplate.builder()
                    .name("Beginner Push Day")
                    .description("Perfect for beginners focusing on chest, shoulders, and triceps")
                    .difficulty("BEGINNER")
                    .category("STRENGTH")
                    .estimatedDuration(25)
                    .createdBy("system")
                    .isPublic(true)
                    .timesUsed(0)
                    .exercises(Arrays.asList(
                            TemplateExercise.builder()
                                    .exerciseType("PUSH_UP")
                                    .sets(3)
                                    .reps(10)
                                    .restSeconds(60)
                                    .notes("Keep your back straight")
                                    .orderIndex(0)
                                    .build(),
                            TemplateExercise.builder()
                                    .exerciseType("BENCH_PRESS")
                                    .sets(3)
                                    .reps(12)
                                    .restSeconds(90)
                                    .notes("Control the weight")
                                    .orderIndex(1)
                                    .build(),
                            TemplateExercise.builder()
                                    .exerciseType("TRICEP_DIPS")
                                    .sets(3)
                                    .reps(10)
                                    .restSeconds(60)
                                    .notes("Full range of motion")
                                    .orderIndex(2)
                                    .build()
                    ))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Advanced Leg Day
            WorkoutTemplate advancedLegs = WorkoutTemplate.builder()
                    .name("Advanced Leg Crusher")
                    .description("High-volume leg workout for experienced lifters")
                    .difficulty("ADVANCED")
                    .category("STRENGTH")
                    .estimatedDuration(45)
                    .createdBy("system")
                    .isPublic(true)
                    .timesUsed(0)
                    .exercises(Arrays.asList(
                            TemplateExercise.builder()
                                    .exerciseType("SQUATS")
                                    .sets(5)
                                    .reps(20)
                                    .restSeconds(90)
                                    .notes("Deep squats for maximum quad activation")
                                    .orderIndex(0)
                                    .build(),
                            TemplateExercise.builder()
                                    .exerciseType("LUNGES")
                                    .sets(4)
                                    .reps(15)
                                    .restSeconds(60)
                                    .notes("Alternate legs")
                                    .orderIndex(1)
                                    .build(),
                            TemplateExercise.builder()
                                    .exerciseType("DEADLIFT")
                                    .sets(4)
                                    .reps(12)
                                    .restSeconds(120)
                                    .notes("Keep back straight, engage core")
                                    .orderIndex(2)
                                    .build()
                    ))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // HIIT Cardio Blast
            WorkoutTemplate hiitCardio = WorkoutTemplate.builder()
                    .name("HIIT Cardio Blast")
                    .description("20-minute high-intensity interval training")
                    .difficulty("INTERMEDIATE")
                    .category("HIIT")
                    .estimatedDuration(20)
                    .createdBy("system")
                    .isPublic(true)
                    .timesUsed(0)
                    .exercises(Arrays.asList(
                            TemplateExercise.builder()
                                    .exerciseType("JUMP_ROPE")
                                    .sets(3)
                                    .reps(100)
                                    .restSeconds(30)
                                    .notes("Fast pace")
                                    .orderIndex(0)
                                    .build(),
                            TemplateExercise.builder()
                                    .exerciseType("BURPEES")
                                    .sets(3)
                                    .reps(15)
                                    .restSeconds(45)
                                    .notes("Explosive movement")
                                    .orderIndex(1)
                                    .build(),
                            TemplateExercise.builder()
                                    .exerciseType("RUNNING")
                                    .sets(1)
                                    .reps(1)
                                    .restSeconds(0)
                                    .notes("5-minute cool-down jog")
                                    .orderIndex(2)
                                    .build()
                    ))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            templateRepository.saveAll(Arrays.asList(beginnerPush, advancedLegs, hiitCardio));
            log.info("Pre-built templates created successfully!");
        }
    }
}
