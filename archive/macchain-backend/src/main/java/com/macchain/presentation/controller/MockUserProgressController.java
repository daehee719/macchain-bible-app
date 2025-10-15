package com.macchain.presentation.controller;

import com.macchain.presentation.dto.ReadingProgressResponse;
import com.macchain.presentation.dto.UserProgressResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 개발 환경용 Mock 사용자 진행률 REST 컨트롤러
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000"})
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "dev", matchIfMissing = true)
public class MockUserProgressController {
    
    // 메모리 기반 진행률 저장소 (개발용)
    private static final Map<Long, UserProgressResponse> userProgress = new HashMap<>();
    
    static {
        // 기본 테스트 사용자 진행률 생성
        List<ReadingProgressResponse> readings = Arrays.asList(
            new ReadingProgressResponse("genesis", 5, true),
            new ReadingProgressResponse("ezra", 5, false),
            new ReadingProgressResponse("matthew", 5, true),
            new ReadingProgressResponse("acts", 5, false)
        );
        
        UserProgressResponse testProgress = new UserProgressResponse(
            1L,
            1L,
            LocalDate.now(),
            5,
            readings,
            2,
            4,
            50.0,
            LocalDateTime.now().minusHours(1),
            LocalDateTime.now()
        );
        
        userProgress.put(1L, testProgress);
    }
    
    /**
     * Mock 사용자의 오늘 읽기 진행률 조회
     */
    @GetMapping("/{userId}/progress")
    public ResponseEntity<UserProgressResponse> getUserProgress(@PathVariable Long userId) {
        try {
            UserProgressResponse progress = userProgress.get(userId);
            
            if (progress != null) {
                return ResponseEntity.ok(progress);
            } else {
                // 진행률이 없으면 기본 진행률 생성
                UserProgressResponse defaultProgress = createDefaultUserProgress(userId);
                userProgress.put(userId, defaultProgress);
                return ResponseEntity.ok(defaultProgress);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Mock 사용자의 특정 날짜 읽기 진행률 조회
     */
    @GetMapping("/{userId}/progress/{date}")
    public ResponseEntity<UserProgressResponse> getUserProgressByDate(
            @PathVariable Long userId,
            @PathVariable String date) {
        try {
            // 간단히 오늘 진행률 반환 (Mock)
            return getUserProgress(userId);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Mock 읽기 진행률 업데이트
     */
    @PutMapping("/{userId}/progress")
    public ResponseEntity<UserProgressResponse> updateUserProgress(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> updateRequest) {
        try {
            UserProgressResponse currentProgress = userProgress.get(userId);
            
            if (currentProgress == null) {
                currentProgress = createDefaultUserProgress(userId);
            }
            
            // 간단한 업데이트 로직 (실제로는 더 복잡해야 함)
            String book = (String) updateRequest.get("book");
            Integer chapter = (Integer) updateRequest.get("chapter");
            Boolean completed = (Boolean) updateRequest.get("completed");
            
            if (book != null && chapter != null && completed != null) {
                // 읽기 상태 업데이트
                List<ReadingProgressResponse> readings = currentProgress.getReadings();
                for (ReadingProgressResponse reading : readings) {
                    if (reading.getBook().equals(book) && reading.getChapter() == chapter) {
                        reading.setCompleted(completed);
                        break;
                    }
                }
                
                // 완료된 읽기 수 재계산
                long completedCount = readings.stream().mapToLong(r -> r.isCompleted() ? 1 : 0).sum();
                double progressPercentage = (completedCount * 100.0) / readings.size();
                
                UserProgressResponse updatedProgress = new UserProgressResponse(
                    currentProgress.getId(),
                    currentProgress.getUserId(),
                    currentProgress.getReadingDate(),
                    currentProgress.getDayNumber(),
                    readings,
                    (int) completedCount,
                    readings.size(),
                    progressPercentage,
                    currentProgress.getCreatedAt(),
                    LocalDateTime.now()
                );
                
                userProgress.put(userId, updatedProgress);
                return ResponseEntity.ok(updatedProgress);
            }
            
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private UserProgressResponse createDefaultUserProgress(Long userId) {
        List<ReadingProgressResponse> readings = Arrays.asList(
            new ReadingProgressResponse("genesis", 5, false),
            new ReadingProgressResponse("ezra", 5, false),
            new ReadingProgressResponse("matthew", 5, false),
            new ReadingProgressResponse("acts", 5, false)
        );
        
        return new UserProgressResponse(
            userId,
            userId,
            LocalDate.now(),
            5,
            readings,
            0,
            4,
            0.0,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }
}
