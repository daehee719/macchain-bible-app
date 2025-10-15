package com.macchain.presentation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 사용자 통계 응답 DTO
 */
public class UserStatisticsResponse {
    private Long id;
    private Long userId;
    private LocalDate statisticsDate;
    
    // 기본 통계
    private int totalDaysRead;
    private int consecutiveDays;
    private int totalChaptersRead;
    private double averageProgress;
    private int perfectDays;
    
    // 월별 통계
    private int currentMonthDays;
    private int currentMonthChapters;
    private double currentMonthProgress;
    
    // 연도별 통계
    private int currentYearDays;
    private int currentYearChapters;
    private double currentYearProgress;
    
    // 최고 기록
    private int longestStreak;
    private LocalDate longestStreakStart;
    private LocalDate longestStreakEnd;
    
    // 최근 7일 통계
    private List<DailyProgressResponse> last7Days;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public UserStatisticsResponse() {}
    
    // 전체 생성자
    public UserStatisticsResponse(Long id, Long userId, LocalDate statisticsDate, 
                                 int totalDaysRead, int consecutiveDays, int totalChaptersRead, 
                                 double averageProgress, int perfectDays, int currentMonthDays, 
                                 int currentMonthChapters, double currentMonthProgress, 
                                 int currentYearDays, int currentYearChapters, double currentYearProgress, 
                                 int longestStreak, LocalDate longestStreakStart, LocalDate longestStreakEnd, 
                                 List<DailyProgressResponse> last7Days, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.statisticsDate = statisticsDate;
        this.totalDaysRead = totalDaysRead;
        this.consecutiveDays = consecutiveDays;
        this.totalChaptersRead = totalChaptersRead;
        this.averageProgress = averageProgress;
        this.perfectDays = perfectDays;
        this.currentMonthDays = currentMonthDays;
        this.currentMonthChapters = currentMonthChapters;
        this.currentMonthProgress = currentMonthProgress;
        this.currentYearDays = currentYearDays;
        this.currentYearChapters = currentYearChapters;
        this.currentYearProgress = currentYearProgress;
        this.longestStreak = longestStreak;
        this.longestStreakStart = longestStreakStart;
        this.longestStreakEnd = longestStreakEnd;
        this.last7Days = last7Days;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public LocalDate getStatisticsDate() { return statisticsDate; }
    public void setStatisticsDate(LocalDate statisticsDate) { this.statisticsDate = statisticsDate; }
    
    public int getTotalDaysRead() { return totalDaysRead; }
    public void setTotalDaysRead(int totalDaysRead) { this.totalDaysRead = totalDaysRead; }
    
    public int getConsecutiveDays() { return consecutiveDays; }
    public void setConsecutiveDays(int consecutiveDays) { this.consecutiveDays = consecutiveDays; }
    
    public int getTotalChaptersRead() { return totalChaptersRead; }
    public void setTotalChaptersRead(int totalChaptersRead) { this.totalChaptersRead = totalChaptersRead; }
    
    public double getAverageProgress() { return averageProgress; }
    public void setAverageProgress(double averageProgress) { this.averageProgress = averageProgress; }
    
    public int getPerfectDays() { return perfectDays; }
    public void setPerfectDays(int perfectDays) { this.perfectDays = perfectDays; }
    
    public int getCurrentMonthDays() { return currentMonthDays; }
    public void setCurrentMonthDays(int currentMonthDays) { this.currentMonthDays = currentMonthDays; }
    
    public int getCurrentMonthChapters() { return currentMonthChapters; }
    public void setCurrentMonthChapters(int currentMonthChapters) { this.currentMonthChapters = currentMonthChapters; }
    
    public double getCurrentMonthProgress() { return currentMonthProgress; }
    public void setCurrentMonthProgress(double currentMonthProgress) { this.currentMonthProgress = currentMonthProgress; }
    
    public int getCurrentYearDays() { return currentYearDays; }
    public void setCurrentYearDays(int currentYearDays) { this.currentYearDays = currentYearDays; }
    
    public int getCurrentYearChapters() { return currentYearChapters; }
    public void setCurrentYearChapters(int currentYearChapters) { this.currentYearChapters = currentYearChapters; }
    
    public double getCurrentYearProgress() { return currentYearProgress; }
    public void setCurrentYearProgress(double currentYearProgress) { this.currentYearProgress = currentYearProgress; }
    
    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }
    
    public LocalDate getLongestStreakStart() { return longestStreakStart; }
    public void setLongestStreakStart(LocalDate longestStreakStart) { this.longestStreakStart = longestStreakStart; }
    
    public LocalDate getLongestStreakEnd() { return longestStreakEnd; }
    public void setLongestStreakEnd(LocalDate longestStreakEnd) { this.longestStreakEnd = longestStreakEnd; }
    
    public List<DailyProgressResponse> getLast7Days() { return last7Days; }
    public void setLast7Days(List<DailyProgressResponse> last7Days) { this.last7Days = last7Days; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    /**
     * 일별 진행률 응답 DTO
     */
    public static class DailyProgressResponse {
        private LocalDate date;
        private int chaptersRead;
        private double progressPercentage;
        private boolean completed;
        
        public DailyProgressResponse() {}
        
        public DailyProgressResponse(LocalDate date, int chaptersRead, double progressPercentage, boolean completed) {
            this.date = date;
            this.chaptersRead = chaptersRead;
            this.progressPercentage = progressPercentage;
            this.completed = completed;
        }
        
        // Getters and Setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        
        public int getChaptersRead() { return chaptersRead; }
        public void setChaptersRead(int chaptersRead) { this.chaptersRead = chaptersRead; }
        
        public double getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }
        
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }
}

