package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("RESPONSE FROM AI received");
        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String rawText = textNode.asText();

            // Find JSON object boundaries
            int jsonStart = rawText.indexOf('{');
            int jsonEnd = rawText.lastIndexOf('}') + 1;

            String jsonContent = rawText.substring(jsonStart, jsonEnd);

            log.info("Extracted JSON content");

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall Performance:\n");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "\nPace & Intensity:\n");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "\nCardiovascular Impact:\n");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "\nCalorie Efficiency:\n");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error processing AI response: {}", e.getMessage());
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis at this time. Please try again later.")
                .improvements(Arrays.asList(
                        "Focus on proper form and technique",
                        "Gradually increase intensity over time",
                        "Maintain consistency in your workout schedule"
                ))
                .suggestions(Arrays.asList(
                        "Try complementary exercises to target different muscle groups",
                        "Include rest days for proper recovery",
                        "Consider progressive overload for continued improvement"
                ))
                .safety(Arrays.asList(
                        "Always warm up for 5-10 minutes before exercise",
                        "Stay hydrated throughout your workout",
                        "Listen to your body and rest if you feel pain",
                        "Cool down and stretch after completing your workout"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty() ?
                Arrays.asList(
                        "Maintain proper form throughout the exercise",
                        "Stay hydrated before, during, and after workout",
                        "Allow adequate rest between sets and workouts",
                        "Consult a fitness professional if experiencing pain"
                ) :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty() ?
                Arrays.asList(
                        "Include complementary exercises for balanced fitness",
                        "Try progressive variations to challenge yourself",
                        "Add flexibility training for injury prevention"
                ) :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty() ?
                Arrays.asList(
                        "Form: Focus on maintaining proper posture and technique",
                        "Intensity: Gradually increase difficulty as you progress",
                        "Recovery: Ensure adequate rest between workout sessions"
                ) :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        String setsRepsInfo = "";
        if (activity.getAdditionalMetrics() != null) {
            Object sets = activity.getAdditionalMetrics().get("sets");
            Object reps = activity.getAdditionalMetrics().get("reps");
            if (sets != null && reps != null) {
                setsRepsInfo = String.format("\nSets: %s\nReps per set: %s", sets, reps);
            }
        }

        return String.format("""
        You are an expert fitness coach and certified personal trainer with 15+ years of experience.
        Provide comprehensive, personalized, and actionable recommendations for this workout.

        WORKOUT DETAILS:
        Exercise Type: %s
        Duration: %d minutes
        Calories Burned: %d%s

        Analyze this workout and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Provide a comprehensive 3-4 sentence analysis of the overall workout performance.",
            "pace": "Analyze the workout pace and intensity level.",
            "heartRate": "Estimate the heart rate zone and cardiovascular benefits.",
            "caloriesBurned": "Evaluate calorie burn efficiency for this exercise."
          },
          "improvements": [
            {
              "area": "Form & Technique",
              "recommendation": "Provide detailed advice on improving exercise form."
            },
            {
              "area": "Progressive Overload",
              "recommendation": "Suggest ways to progressively increase difficulty."
            },
            {
              "area": "Recovery & Performance",
              "recommendation": "Provide recovery and performance enhancement advice."
            }
          ],
          "suggestions": [
            {
              "workout": "Complementary Exercise",
              "description": "Suggest a complementary exercise with benefits."
            },
            {
              "workout": "Advanced Progression",
              "description": "Recommend a more challenging variation."
            },
            {
              "workout": "Active Recovery",
              "description": "Suggest a recovery-focused exercise."
            }
          ],
          "safety": [
            "Provide a specific warm-up routine for this exercise.",
            "List common form errors and injury risks.",
            "Recommend optimal rest periods.",
            "Provide hydration and nutrition tips."
          ]
        }

        GUIDELINES:
        - Be specific and actionable
        - Reference actual workout details (type: %s, duration: %d min, calories: %d)
        - Incorporate sets/reps data if available
        - Focus on injury prevention and sustainable progress
        
        Ensure response follows the EXACT JSON format above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                setsRepsInfo,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned()
        );
    }
}
