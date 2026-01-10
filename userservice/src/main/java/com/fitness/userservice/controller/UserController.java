package com.fitness.userservice.controller;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UpdateProfileRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId){
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(userService.register(request));
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId){
        return ResponseEntity.ok(userService.existByUserId(userId));
    }

    // ========== NEW ENDPOINTS FOR PROFILE ==========

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfileByKeycloak(@RequestHeader("X-User-ID") String keycloakId) {
        return ResponseEntity.ok(userService.getProfileByKeycloakId(keycloakId));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfileByKeycloak(
            @RequestHeader("X-User-ID") String keycloakId,
            @RequestBody UpdateProfileRequest req
    ) {
        return ResponseEntity.ok(userService.updateProfileByKeycloakId(keycloakId, req));
    }
}
