package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UpdateProfileRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository repository;

    public UserResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {

            /// ///////////////**********////////////////////////////////
            User existingUser = repository.findByEmail(request.getEmail());

            //Create user UserResponse Object
            UserResponse userResponse = new UserResponse();

            userResponse.setId(existingUser.getId());
            userResponse.setKeycloakId(existingUser.getKeycloakId());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());

            // ADD PROFILE FIELDS
            userResponse.setAge(existingUser.getAge());
            userResponse.setWeight(existingUser.getWeight());
            userResponse.setGender(existingUser.getGender());
            userResponse.setHeight(existingUser.getHeight());

            return userResponse;
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);

        /////////////////////////////////////////////
        UserResponse userResponse = new UserResponse();
        userResponse.setKeycloakId(savedUser.getKeycloakId());
        userResponse.setId(savedUser.getId());
        userResponse.setPassword(savedUser.getPassword());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());

        // ADD PROFILE FIELDS
        userResponse.setAge(savedUser.getAge());
        userResponse.setWeight(savedUser.getWeight());
        userResponse.setGender(savedUser.getGender());
        userResponse.setHeight(savedUser.getHeight());

        return userResponse;
    }

    public UserResponse getUserProfile(String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setKeycloakId(user.getKeycloakId());
        userResponse.setPassword(user.getPassword());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());

        // ADD PROFILE FIELDS
        userResponse.setAge(user.getAge());
        userResponse.setWeight(user.getWeight());
        userResponse.setGender(user.getGender());
        userResponse.setHeight(user.getHeight());

        return userResponse;
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        return repository.existsByKeycloakId(userId);
    }

    // ========== NEW METHODS FOR PROFILE ==========

    public UserResponse getProfileByKeycloakId(String keycloakId) {
        User user = repository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User Not Found");
        }

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setKeycloakId(user.getKeycloakId());
        userResponse.setPassword(user.getPassword());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());

        // SET PROFILE FIELDS
        userResponse.setAge(user.getAge());
        userResponse.setWeight(user.getWeight());
        userResponse.setGender(user.getGender());
        userResponse.setHeight(user.getHeight());

        return userResponse;
    }

    public UserResponse updateProfileByKeycloakId(String keycloakId, UpdateProfileRequest req) {
        User user = repository.findByKeycloakId(keycloakId);
        if (user == null) {
            throw new RuntimeException("User Not Found");
        }

        user.setAge(req.getAge());
        user.setWeight(req.getWeight());
        user.setGender(req.getGender());
        user.setHeight(req.getHeight());

        repository.save(user);

        return getProfileByKeycloakId(keycloakId);
    }
}
