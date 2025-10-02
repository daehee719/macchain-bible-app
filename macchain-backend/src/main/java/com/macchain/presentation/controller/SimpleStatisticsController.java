package com.macchain.presentation.controller;

import com.macchain.domain.port.UserProgressRepository;
import com.macchain.domain.entity.UserProgress;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 간단한 통계 컨트롤러
 * TODO: 실제 통계 계산 로직을 구현하여 UserStatisticsController로 대체 예정
 */
@RestController
@RequestMapping("/api/users/{userId}/statistics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006"})
public class SimpleStatisticsController {
    
    private final UserProgressRepository userProgressRepository;
    
    public SimpleStatisticsController(UserProgressRepository userProgressRepository) {
        this.userProgressRepository = userProgressRepository;
    }
    
    /**
     * 사용자의 최신 통계 조회 (실제 데이터 기반)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getLatestStatistics(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        // 기본 통계
        response.put("id", 1L);
        response.put("userId", userId);
        response.put("statisticsDate", LocalDate.now().toString());
        
        // 실제 UserProgress 데이터 조회
        Optional<UserProgress> todayProgress = userProgressRepository.findByUserIdAndReadingDate(userId, LocalDate.now());
        
        if (todayProgress.isPresent()) {
            UserProgress progress = todayProgress.get();
            
            // 실제 데이터 기반 통계
            response.put("totalDaysRead", 1); // 오늘만 읽음
            response.put("consecutiveDays", 1); // 연속 1일
            response.put("totalChaptersRead", progress.getCompletedReadings());
            response.put("averageProgress", progress.getProgressPercentage());
            response.put("perfectDays", progress.getProgressPercentage() >= 100.0 ? 1 : 0);
            
            // 월별 통계
            response.put("currentMonthDays", 1);
            response.put("currentMonthChapters", progress.getCompletedReadings());
            response.put("currentMonthProgress", progress.getProgressPercentage());
            
            // 연도별 통계
            response.put("currentYearDays", 1);
            response.put("currentYearChapters", progress.getCompletedReadings());
            response.put("currentYearProgress", progress.getProgressPercentage());
            
            // 최고 기록
            response.put("longestStreak", 1);
            response.put("longestStreakStart", LocalDate.now().toString());
            response.put("longestStreakEnd", LocalDate.now().toString());
            
            // 최근 7일 통계 (오늘만 읽음)
            List<Map<String, Object>> last7Days = new ArrayList<>();
            for (int i = 6; i >= 0; i--) {
                Map<String, Object> daily = new HashMap<>();
                daily.put("date", LocalDate.now().minusDays(i).toString());
                if (i == 0) {
                    // 오늘 데이터
                    daily.put("chaptersRead", progress.getCompletedReadings());
                    daily.put("progressPercentage", progress.getProgressPercentage());
                    daily.put("completed", progress.getProgressPercentage() >= 100.0);
                } else {
                    // 다른 날은 읽지 않음
                    daily.put("chaptersRead", 0);
                    daily.put("progressPercentage", 0.0);
                    daily.put("completed", false);
                }
                last7Days.add(daily);
            }
            response.put("last7Days", last7Days);
        } else {
            // 진행률 데이터가 없는 경우
            response.put("totalDaysRead", 0);
            response.put("consecutiveDays", 0);
            response.put("totalChaptersRead", 0);
            response.put("averageProgress", 0.0);
            response.put("perfectDays", 0);
            
            // 월별/연도별 통계
            response.put("currentMonthDays", 0);
            response.put("currentMonthChapters", 0);
            response.put("currentMonthProgress", 0.0);
            response.put("currentYearDays", 0);
            response.put("currentYearChapters", 0);
            response.put("currentYearProgress", 0.0);
            
            // 최고 기록
            response.put("longestStreak", 0);
            response.put("longestStreakStart", null);
            response.put("longestStreakEnd", null);
            
            // 최근 7일 통계 (모두 0)
            List<Map<String, Object>> last7Days = new ArrayList<>();
            for (int i = 6; i >= 0; i--) {
                Map<String, Object> daily = new HashMap<>();
                daily.put("date", LocalDate.now().minusDays(i).toString());
                daily.put("chaptersRead", 0);
                daily.put("progressPercentage", 0.0);
                daily.put("completed", false);
                last7Days.add(daily);
            }
            response.put("last7Days", last7Days);
        }
        
        response.put("createdAt", LocalDateTime.now().toString());
        response.put("updatedAt", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 통계 새로고침 (더미 데이터)
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshStatistics(@PathVariable Long userId) {
        return getLatestStatistics(userId);
    }
}
