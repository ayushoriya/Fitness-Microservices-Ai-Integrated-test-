package com.fitness.userservice.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private Integer age;
    private Double weight;
    private String gender;
    private Double height;
}
