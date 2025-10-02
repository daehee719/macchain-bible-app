package com.macchain.presentation.controller;

import com.macchain.application.usecase.GetUserProgressUseCase;
import com.macchain.application.usecase.UpdateUserProgressUseCase;
import com.macchain.domain.entity.UserProgress;
import com.macchain.domain.port.UserProgressRepository;
import com.macchain.domain.valueobject.ReadingProgress;
import com.macchain.presentation.dto.UserProgressResponse;
import com.macchain.presentation.dto.ReadingProgressResponse;
import com.macchain.presentation.mapper.UserProgressResponseMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * 사용자 읽기 진행률 REST 컨트롤러
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3003"})
public class UserProgressController {
    
    private final GetUserProgressUseCase getUserProgressUseCase;
    private final UpdateUserProgressUseCase updateUserProgressUseCase;
    private final UserProgressResponseMapper responseMapper;
    private final UserProgressRepository userProgressRepository;
    
    public UserProgressController(GetUserProgressUseCase getUserProgressUseCase,
                                UpdateUserProgressUseCase updateUserProgressUseCase,
                                UserProgressResponseMapper responseMapper,
                                UserProgressRepository userProgressRepository) {
        this.getUserProgressUseCase = getUserProgressUseCase;
        this.updateUserProgressUseCase = updateUserProgressUseCase;
        this.responseMapper = responseMapper;
        this.userProgressRepository = userProgressRepository;
    }
    
    /**
     * 사용자의 오늘 읽기 진행률 조회
     */
    @GetMapping("/{userId}/progress")
    @Cacheable(value = "user-progress", key = "#userId + '_' + T(java.time.LocalDate).now().toString()")
    public ResponseEntity<UserProgressResponse> getUserProgress(@PathVariable Long userId) {
        Optional<UserProgress> userProgress = getUserProgressUseCase.execute(userId);
        
        if (userProgress.isPresent()) {
            UserProgressResponse response = responseMapper.toResponse(userProgress.get());
            return ResponseEntity.ok(response);
        } else {
            // 진행률이 없으면 기본 UserProgress 엔티티를 생성하고 저장
            UserProgress defaultProgress = createDefaultUserProgress(userId);
            UserProgress savedProgress = userProgressRepository.save(defaultProgress);
            UserProgressResponse response = responseMapper.toResponse(savedProgress);
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * 사용자의 특정 날짜 읽기 진행률 조회
     */
    @GetMapping("/{userId}/progress/{date}")
    public ResponseEntity<UserProgressResponse> getUserProgressByDate(
            @PathVariable Long userId, 
            @PathVariable String date) {
        LocalDate readingDate = LocalDate.parse(date);
        Optional<UserProgress> userProgress = getUserProgressUseCase.execute(userId, readingDate);
        
        if (userProgress.isPresent()) {
            UserProgressResponse response = responseMapper.toResponse(userProgress.get());
            return ResponseEntity.ok(response);
        } else {
            // 진행률이 없으면 기본값으로 생성
            UserProgressResponse defaultResponse = createDefaultUserProgressResponse(userId);
            return ResponseEntity.ok(defaultResponse);
        }
    }
    
    /**
     * 읽기 완료 상태 업데이트
     */
    @PostMapping("/{userId}/progress/update")
    @CacheEvict(value = "user-progress", key = "#userId + '_' + T(java.time.LocalDate).now().toString()")
    public ResponseEntity<UserProgressResponse> updateUserProgress(
            @PathVariable Long userId,
            @RequestBody UpdateProgressRequest request) {
        
        UserProgress updatedProgress = updateUserProgressUseCase.execute(
                userId, 
                request.getReadingId(), 
                request.isCompleted()
        );
        
        UserProgressResponse response = responseMapper.toResponse(updatedProgress);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 진행률 초기화 (개발/테스트용)
     */
    @PostMapping("/{userId}/progress/reset")
    public ResponseEntity<UserProgressResponse> resetUserProgress(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        
        // 기존 진행률 삭제 후 새로 생성
        userProgressRepository.findByUserIdAndReadingDate(userId, today)
                .ifPresent(progress -> {
                    // 기본값으로 리셋
                    progress.setCompletedReadings(0);
                    progress.setProgressPercentage(0.0);
                    progress.setUpdatedAt(LocalDateTime.now());
                    userProgressRepository.save(progress);
                });
        
        // 새로운 진행률 조회
        Optional<UserProgress> userProgressOptional = getUserProgressUseCase.execute(userId, today);
        if (userProgressOptional.isPresent()) {
            UserProgressResponse response = responseMapper.toResponse(userProgressOptional.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    
    /**
     * 기본 UserProgressResponse 생성
     */
    private UserProgressResponse createDefaultUserProgressResponse(Long userId) {
        List<ReadingProgressResponse> defaultReadings = Arrays.asList(
                new ReadingProgressResponse("genesis", 1, false),
                new ReadingProgressResponse("ezra", 1, false),
                new ReadingProgressResponse("matthew", 1, false),
                new ReadingProgressResponse("acts", 1, false)
        );
        
        return new UserProgressResponse(
                null, // ID
                userId,
                LocalDate.now(),
                1, // Day 1
                defaultReadings,
                0, // completedReadings
                4, // totalReadings
                0.0, // progressPercentage
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    /**
     * 기본 UserProgress 엔티티 생성
     * TODO: 실제 맥체인 플랜 서비스를 주입받아 동적으로 생성하도록 개선 필요
     */
    private UserProgress createDefaultUserProgress(Long userId) {
        // 오늘의 맥체인 플랜을 가져와서 기본 ReadingProgress 생성
        // 현재는 하드코딩된 값 사용 (Day 1 플랜)
        List<ReadingProgress> defaultReadings = Arrays.asList(
                new ReadingProgress("genesis", 1, false),
                new ReadingProgress("ezra", 1, false),
                new ReadingProgress("matthew", 1, false),
                new ReadingProgress("acts", 1, false)
        );
        
        LocalDateTime now = LocalDateTime.now();
        
        return new UserProgress(
                null, // ID는 저장 시 생성
                userId,
                LocalDate.now(),
                1, // 기본 Day 1
                defaultReadings, // 기본 읽기 목록
                0, // 완료된 읽기 수
                4, // 총 읽기 수 (맥체인 플랜)
                0.0, // 진행률 0%
                now, // createdAt
                now  // updatedAt
        );
    }
    
    /**
     * 진행률 업데이트 요청 DTO
     */
    public static class UpdateProgressRequest {
        private String readingId;
        private boolean completed;
        
        // 기본 생성자
        public UpdateProgressRequest() {}
        
        // 전체 생성자
        public UpdateProgressRequest(String readingId, boolean completed) {
            this.readingId = readingId;
            this.completed = completed;
        }
        
        // Getters and Setters
        public String getReadingId() {
            return readingId;
        }
        
        public void setReadingId(String readingId) {
            this.readingId = readingId;
        }
        
        public boolean isCompleted() {
            return completed;
        }
        
        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }
}
