package com.macchain.presentation.controller;

import com.macchain.presentation.dto.UserRequest;
import com.macchain.presentation.dto.UserResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 개발 환경용 Mock 사용자 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000"})
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "dev", matchIfMissing = true)
public class MockUserController {
    
    // 메모리 기반 사용자 저장소 (개발용)
    private static final Map<String, UserResponse> users = new HashMap<>();
    private static Long nextId = 1L;
    
    static {
        // 기본 테스트 사용자 생성
        UserResponse testUser = new UserResponse(
            1L,
            "test@example.com",
            "테스트 사용자",
            "testuser",
            LocalDateTime.now().minusDays(1),
            LocalDateTime.now(),
            true
        );
        users.put("test@example.com", testUser);
        nextId = 2L;
    }
    
    /**
     * Mock 사용자 회원가입
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRequest request) {
        try {
            // 기본 검증
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            if (request.getPassword() == null || request.getPassword().length() < 8) {
                return ResponseEntity.badRequest().build();
            }
            
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            if (request.getNickname() == null || request.getNickname().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            // 중복 검사
            if (users.containsKey(request.getEmail())) {
                return ResponseEntity.badRequest().build();
            }
            
            // 닉네임 중복 검사
            boolean nicknameExists = users.values().stream()
                .anyMatch(user -> user.getNickname().equals(request.getNickname()));
            if (nicknameExists) {
                return ResponseEntity.badRequest().build();
            }
            
            // 새 사용자 생성
            UserResponse newUser = new UserResponse(
                nextId++,
                request.getEmail(),
                request.getName(),
                request.getNickname(),
                LocalDateTime.now(),
                null,
                true
            );
            
            users.put(request.getEmail(), newUser);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Mock 사용자 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {
        try {
            UserResponse user = users.get(request.getEmail());
            
            if (user != null && user.isActive()) {
                // 실제로는 비밀번호 검증을 해야 하지만, Mock에서는 간단히 처리
                // 로그인 시간 업데이트
                UserResponse updatedUser = new UserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getNickname(),
                    user.getCreatedAt(),
                    LocalDateTime.now(),
                    user.isActive()
                );
                
                users.put(request.getEmail(), updatedUser);
                
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Mock 사용자 정보 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId) {
        try {
            UserResponse user = users.values().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElse(null);
            
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Mock 사용자 목록 조회 (개발용)
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, UserResponse>> getAllUsers() {
        return ResponseEntity.ok(users);
    }
}
