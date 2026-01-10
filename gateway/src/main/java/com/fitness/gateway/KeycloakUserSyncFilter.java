package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 10) // Run AFTER CORS filter
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // ✅ SKIP OPTIONS PREFLIGHT REQUESTS (CRITICAL!)
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
            log.debug("Skipping OPTIONS preflight request");
            return chain.filter(exchange);
        }

        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");

        // ✅ NULL CHECK: Skip if no token
        if (token == null || token.trim().isEmpty()) {
            log.debug("No Authorization token found, skipping user sync");
            return chain.filter(exchange);
        }

        RegisterRequest registerRequest = getUserDetails(token);

        // ✅ NULL CHECK: Skip if token parsing failed
        if (registerRequest == null) {
            log.warn("Failed to parse JWT token, skipping user sync");
            return chain.filter(exchange);
        }

        if (userId == null || userId.isEmpty()) {
            userId = registerRequest.getKeycloakId();
        }

        // ✅ NULL CHECK: Skip if no userId
        if (userId == null || userId.isEmpty()) {
            log.warn("No userId found in token or headers, skipping user sync");
            return chain.filter(exchange);
        }

        String finalUserId = userId;

        return userService.validateUser(userId)
                .flatMap(exist -> {
                    if (!exist) {
                        // Register User
                        log.info("User does not exist, registering: {}", registerRequest.getEmail());
                        return userService.registerUser(registerRequest)
                                .doOnSuccess(user -> log.info("User registered successfully: {}", user.getEmail()))
                                .doOnError(e -> log.error("Failed to register user: {}", e.getMessage()))
                                .then();
                    } else {
                        log.debug("User already exists, skipping sync: {}", finalUserId);
                        return Mono.empty();
                    }
                })
                .onErrorResume(e -> {
                    // ✅ CRITICAL: Don't block request if sync fails
                    log.error("Error during user sync, continuing request: {}", e.getMessage());
                    return Mono.empty();
                })
                .then(Mono.defer(() -> {
                    // Add userId to request headers
                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                            .header("X-User-ID", finalUserId)
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }));
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            // ✅ NULL & EMPTY CHECKS
            if (token == null || token.trim().isEmpty()) {
                log.debug("Token is null or empty");
                return null;
            }

            // ✅ CHECK if Bearer token
            if (!token.startsWith("Bearer ")) {
                log.warn("Invalid token format, expected 'Bearer ' prefix");
                return null;
            }

            String tokenWithoutBearer = token.replace("Bearer ", "").trim();

            // ✅ CHECK if token is empty after removing Bearer
            if (tokenWithoutBearer.isEmpty()) {
                log.warn("Token is empty after removing 'Bearer ' prefix");
                return null;
            }

            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setPassword("dummy@123123");
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));

            log.debug("Successfully parsed JWT token for user: {}", registerRequest.getEmail());
            return registerRequest;

        } catch (Exception e) {
            log.error("Error parsing JWT token: {}", e.getMessage());
            return null;
        }
    }
}
