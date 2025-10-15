package com.macchain.presentation.controller;

import com.macchain.application.usecase.GetUserStatisticsUseCase;
import com.macchain.domain.entity.UserStatistics;
import com.macchain.presentation.dto.UserStatisticsResponse;
import com.macchain.presentation.mapper.UserStatisticsResponseMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 사용자 통계 REST 컨트롤러
 */
// @RestController
@RequestMapping("/api/users/{userId}/statistics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006"})
public class UserStatisticsController {
    
    private final GetUserStatisticsUseCase getUserStatisticsUseCase;
    private final UserStatisticsResponseMapper responseMapper;
    
    public UserStatisticsController(GetUserStatisticsUseCase getUserStatisticsUseCase,
                                   UserStatisticsResponseMapper responseMapper) {
        this.getUserStatisticsUseCase = getUserStatisticsUseCase;
        this.responseMapper = responseMapper;
    }
    
    /**
     * 사용자의 최신 통계 조회
     */
    @GetMapping
    public ResponseEntity<UserStatisticsResponse> getLatestStatistics(@PathVariable Long userId) {
        // 임시로 더미 데이터 반환
        UserStatisticsResponse response = createDummyStatistics(userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 더미 통계 데이터 생성 (임시)
     */
    private UserStatisticsResponse createDummyStatistics(Long userId) {
        UserStatisticsResponse response = new UserStatisticsResponse();
        response.setId(1L);
        response.setUserId(userId);
        response.setStatisticsDate(java.time.LocalDate.now());
        
        // 기본 통계
        response.setTotalDaysRead(5);
        response.setConsecutiveDays(3);
        response.setTotalChaptersRead(20);
        response.setAverageProgress(75.0);
        response.setPerfectDays(2);
        
        // 월별 통계
        response.setCurrentMonthDays(5);
        response.setCurrentMonthChapters(20);
        response.setCurrentMonthProgress(75.0);
        
        // 연도별 통계
        response.setCurrentYearDays(5);
        response.setCurrentYearChapters(20);
        response.setCurrentYearProgress(75.0);
        
        // 최고 기록
        response.setLongestStreak(5);
        response.setLongestStreakStart(java.time.LocalDate.now().minusDays(5));
        response.setLongestStreakEnd(java.time.LocalDate.now());
        
        // 최근 7일 통계
        java.util.List<UserStatisticsResponse.DailyProgressResponse> last7Days = new java.util.ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            UserStatisticsResponse.DailyProgressResponse daily = new UserStatisticsResponse.DailyProgressResponse();
            daily.setDate(java.time.LocalDate.now().minusDays(i));
            daily.setChaptersRead(i < 3 ? 4 : 0); // 최근 3일만 읽음
            daily.setProgressPercentage(i < 3 ? 100.0 : 0.0);
            daily.setCompleted(i < 3);
            last7Days.add(daily);
        }
        response.setLast7Days(last7Days);
        
        response.setCreatedAt(java.time.LocalDateTime.now());
        response.setUpdatedAt(java.time.LocalDateTime.now());
        
        return response;
    }
    
    /**
     * 사용자의 특정 날짜 통계 조회
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<UserStatisticsResponse> getStatisticsByDate(
            @PathVariable Long userId, 
            @PathVariable LocalDate date) {
        Optional<UserStatistics> statistics = getUserStatisticsUseCase.getStatisticsByDate(userId, date);
        
        if (statistics.isPresent()) {
            UserStatisticsResponse response = responseMapper.toResponse(statistics.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 사용자의 모든 통계 조회
     */
    @GetMapping("/all")
    public ResponseEntity<List<UserStatisticsResponse>> getAllStatistics(@PathVariable Long userId) {
        List<UserStatistics> statisticsList = getUserStatisticsUseCase.getAllStatistics(userId);
        List<UserStatisticsResponse> responses = statisticsList.stream()
                .map(responseMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
    
    /**
     * 사용자의 월별 통계 조회
     */
    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<List<UserStatisticsResponse>> getMonthlyStatistics(
            @PathVariable Long userId,
            @PathVariable int year,
            @PathVariable int month) {
        List<UserStatistics> statisticsList = getUserStatisticsUseCase.getMonthlyStatistics(userId, year, month);
        List<UserStatisticsResponse> responses = statisticsList.stream()
                .map(responseMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
    
    /**
     * 사용자의 연도별 통계 조회
     */
    @GetMapping("/yearly/{year}")
    public ResponseEntity<List<UserStatisticsResponse>> getYearlyStatistics(
            @PathVariable Long userId,
            @PathVariable int year) {
        List<UserStatistics> statisticsList = getUserStatisticsUseCase.getYearlyStatistics(userId, year);
        List<UserStatisticsResponse> responses = statisticsList.stream()
                .map(responseMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
    
    /**
     * 통계 새로고침 (강제 재계산)
     */
    @PostMapping("/refresh")
    public ResponseEntity<UserStatisticsResponse> refreshStatistics(@PathVariable Long userId) {
        UserStatistics statistics = getUserStatisticsUseCase.refreshStatistics(userId);
        UserStatisticsResponse response = responseMapper.toResponse(statistics);
        return ResponseEntity.ok(response);
    }
}
