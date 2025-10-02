package com.macchain.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 월별 성경 데이터 엔티티
 */
@Entity
@Table(name = "monthly_bible_data", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"year", "month_value", "book", "chapter", "verse"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyBibleData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(name = "month_value", nullable = false)
    private Integer month;
    
    @Column(nullable = false, length = 50)
    private String book;
    
    @Column(nullable = false)
    private Integer chapter;
    
    @Column(nullable = false)
    private Integer verse;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String englishText;
    
    @Column(columnDefinition = "TEXT")
    private String hebrewText;
    
    @Column(columnDefinition = "TEXT")
    private String greekText;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

