package com.macchain.infrastructure.entity;

import com.macchain.infrastructure.converter.DailyProgressListConverter;
import com.macchain.domain.entity.UserStatistics;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 사용자 통계 JPA 엔티티
 */
@Entity
@Table(name = "user_statistics")
public class UserStatisticsJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "statistics_date", nullable = false)
    private LocalDate statisticsDate;
    
    // 기본 통계
    @Column(name = "total_days_read", nullable = false)
    private int totalDaysRead;
    
    @Column(name = "consecutive_days", nullable = false)
    private int consecutiveDays;
    
    @Column(name = "total_chapters_read", nullable = false)
    private int totalChaptersRead;
    
    @Column(name = "average_progress", nullable = false)
    private double averageProgress;
    
    @Column(name = "perfect_days", nullable = false)
    private int perfectDays;
    
    // 월별 통계
    @Column(name = "current_month_days", nullable = false)
    private int currentMonthDays;
    
    @Column(name = "current_month_chapters", nullable = false)
    private int currentMonthChapters;
    
    @Column(name = "current_month_progress", nullable = false)
    private double currentMonthProgress;
    
    // 연도별 통계
    @Column(name = "current_year_days", nullable = false)
    private int currentYearDays;
    
    @Column(name = "current_year_chapters", nullable = false)
    private int currentYearChapters;
    
    @Column(name = "current_year_progress", nullable = false)
    private double currentYearProgress;
    
    // 최고 기록
    @Column(name = "longest_streak", nullable = false)
    private int longestStreak;
    
    @Column(name = "longest_streak_start")
    private LocalDate longestStreakStart;
    
    @Column(name = "longest_streak_end")
    private LocalDate longestStreakEnd;
    
    // 최근 7일 통계
    @Convert(converter = DailyProgressListConverter.class)
    @Column(name = "last_7_days", columnDefinition = "TEXT")
    private List<UserStatistics.DailyProgress> last7Days;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public UserStatisticsJpaEntity() {}
    
    // 전체 생성자
    public UserStatisticsJpaEntity(Long id, Long userId, LocalDate statisticsDate, 
                                  int totalDaysRead, int consecutiveDays, int totalChaptersRead, 
                                  double averageProgress, int perfectDays, int currentMonthDays, 
                                  int currentMonthChapters, double currentMonthProgress, 
                                  int currentYearDays, int currentYearChapters, double currentYearProgress, 
                                  int longestStreak, LocalDate longestStreakStart, LocalDate longestStreakEnd, 
                                  List<UserStatistics.DailyProgress> last7Days, LocalDateTime createdAt, LocalDateTime updatedAt) {
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
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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
    
    public List<UserStatistics.DailyProgress> getLast7Days() { return last7Days; }
    public void setLast7Days(List<UserStatistics.DailyProgress> last7Days) { this.last7Days = last7Days; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

