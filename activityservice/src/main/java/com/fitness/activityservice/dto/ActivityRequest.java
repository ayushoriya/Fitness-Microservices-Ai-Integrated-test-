package com.fitness.activityservice.dto;

import com.fitness.activityservice.model.ActivityType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {
    private String userId;
    private ActivityType type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics;
}



//package com.fitness.activityservice.dto;
//
//import com.fitness.activityservice.model.ActivityType;
//import com.fasterxml.jackson.annotation.JsonFormat;
//import lombok.Data;
//import java.time.LocalDateTime;
//import java.util.Map;
//
//@Data
//public class ActivityRequest {
//    private String userId; // ye header se set hoga
//
//    private ActivityType type;
//    private Integer duration;
//    private Integer caloriesBurned;
//
//    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
//    private LocalDateTime startTime;
//
//    private Map<String, Object> additionalMetrics;
//}
