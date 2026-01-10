package com.fitness.activityservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreakResponse {
    private Integer currentStreak;
    private Integer longestStreak;
    private List<LocalDate> workoutDates;
    private Boolean workedOutToday;
}
