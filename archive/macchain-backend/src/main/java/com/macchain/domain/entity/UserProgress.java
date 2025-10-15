package com.macchain.domain.entity;

import com.macchain.domain.valueobject.ReadingProgress;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 사용자 읽기 진행률 도메인 엔티티
 */
public class UserProgress {
    private Long id;
    private Long userId;
    private LocalDate readingDate;
    private int dayNumber;
    private List<ReadingProgress> readings;
    private int completedReadings;
    private int totalReadings;
    private double progressPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 기본 생성자
    public UserProgress() {}

    // 전체 생성자
    public UserProgress(Long id, Long userId, LocalDate readingDate, int dayNumber,
                       List<ReadingProgress> readings, int completedReadings, int totalReadings,
                       double progressPercentage, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.readingDate = readingDate;
        this.dayNumber = dayNumber;
        this.readings = readings;
        this.completedReadings = completedReadings;
        this.totalReadings = totalReadings;
        this.progressPercentage = progressPercentage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getReadingDate() {
        return readingDate;
    }

    public void setReadingDate(LocalDate readingDate) {
        this.readingDate = readingDate;
    }

    public int getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(int dayNumber) {
        this.dayNumber = dayNumber;
    }

    public List<ReadingProgress> getReadings() {
        return readings;
    }

    public void setReadings(List<ReadingProgress> readings) {
        this.readings = readings;
    }

    public int getCompletedReadings() {
        return completedReadings;
    }

    public void setCompletedReadings(int completedReadings) {
        this.completedReadings = completedReadings;
    }

    public int getTotalReadings() {
        return totalReadings;
    }

    public void setTotalReadings(int totalReadings) {
        this.totalReadings = totalReadings;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "UserProgress{" +
                "id=" + id +
                ", userId=" + userId +
                ", readingDate=" + readingDate +
                ", dayNumber=" + dayNumber +
                ", completedReadings=" + completedReadings +
                ", totalReadings=" + totalReadings +
                ", progressPercentage=" + progressPercentage +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}