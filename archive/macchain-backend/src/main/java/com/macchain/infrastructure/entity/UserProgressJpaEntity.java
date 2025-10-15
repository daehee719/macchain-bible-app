package com.macchain.infrastructure.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.macchain.domain.valueobject.ReadingProgress;
import com.macchain.infrastructure.converter.ReadingProgressListConverter;

/**
 * 사용자 읽기 진행률 JPA 엔티티
 */
@Entity
@Table(name = "user_progress")
public class UserProgressJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "reading_date", nullable = false)
    private LocalDate readingDate;
    
    @Column(name = "day_number", nullable = false)
    private int dayNumber;
    
    @Column(name = "completed_readings", nullable = false)
    private int completedReadings;
    
    @Column(name = "total_readings", nullable = false)
    private int totalReadings;
    
    @Column(name = "progress_percentage", nullable = false)
    private double progressPercentage;
    
    @Convert(converter = ReadingProgressListConverter.class)
    @Column(name = "readings", columnDefinition = "TEXT")
    private List<ReadingProgress> readings;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 기본 생성자
    public UserProgressJpaEntity() {}

    // 전체 생성자
    public UserProgressJpaEntity(Long id, Long userId, LocalDate readingDate, int dayNumber,
                                int completedReadings, int totalReadings, double progressPercentage,
                                List<ReadingProgress> readings, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.readingDate = readingDate;
        this.dayNumber = dayNumber;
        this.completedReadings = completedReadings;
        this.totalReadings = totalReadings;
        this.progressPercentage = progressPercentage;
        this.readings = readings;
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

    public List<ReadingProgress> getReadings() {
        return readings;
    }

    public void setReadings(List<ReadingProgress> readings) {
        this.readings = readings;
    }
}
