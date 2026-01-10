//package com.fitness.apigateway.controller;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//public class FallbackController {
//
//    @GetMapping("/fallback")
//    public ResponseEntity<Map<String, String>> fallback() {
//        Map<String, String> response = new HashMap<>();
//        response.put("error", "Service temporarily unavailable");
//        response.put("message", "Please try again later");
//        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
//    }
//}
