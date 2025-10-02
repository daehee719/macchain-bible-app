package com.macchain.infrastructure.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 맥체인 플랜 JPA 엔티티
 */
@Entity
@Table(name = "mccheyne_plan")
public class McCheynePlanJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "day_number", unique = true, nullable = false)
    private Integer dayNumber;
    
    @Column(name = "reading1_book", nullable = false)
    private String reading1Book;
    
    @Column(name = "reading1_chapter", nullable = false)
    private Integer reading1Chapter;
    
    @Column(name = "reading2_book", nullable = false)
    private String reading2Book;
    
    @Column(name = "reading2_chapter", nullable = false)
    private Integer reading2Chapter;
    
    @Column(name = "reading3_book", nullable = false)
    private String reading3Book;
    
    @Column(name = "reading3_chapter", nullable = false)
    private Integer reading3Chapter;
    
    @Column(name = "reading4_book", nullable = false)
    private String reading4Book;
    
    @Column(name = "reading4_chapter", nullable = false)
    private Integer reading4Chapter;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public McCheynePlanJpaEntity() {}
    
    // 모든 필드 생성자
    public McCheynePlanJpaEntity(Long id, Integer dayNumber, String reading1Book, Integer reading1Chapter,
                                String reading2Book, Integer reading2Chapter, String reading3Book, Integer reading3Chapter,
                                String reading4Book, Integer reading4Chapter, LocalDateTime createdAt) {
        this.id = id;
        this.dayNumber = dayNumber;
        this.reading1Book = reading1Book;
        this.reading1Chapter = reading1Chapter;
        this.reading2Book = reading2Book;
        this.reading2Chapter = reading2Chapter;
        this.reading3Book = reading3Book;
        this.reading3Chapter = reading3Chapter;
        this.reading4Book = reading4Book;
        this.reading4Chapter = reading4Chapter;
        this.createdAt = createdAt;
    }
    
    // Getter/Setter 메서드들
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
    
    public String getReading1Book() { return reading1Book; }
    public void setReading1Book(String reading1Book) { this.reading1Book = reading1Book; }
    
    public Integer getReading1Chapter() { return reading1Chapter; }
    public void setReading1Chapter(Integer reading1Chapter) { this.reading1Chapter = reading1Chapter; }
    
    public String getReading2Book() { return reading2Book; }
    public void setReading2Book(String reading2Book) { this.reading2Book = reading2Book; }
    
    public Integer getReading2Chapter() { return reading2Chapter; }
    public void setReading2Chapter(Integer reading2Chapter) { this.reading2Chapter = reading2Chapter; }
    
    public String getReading3Book() { return reading3Book; }
    public void setReading3Book(String reading3Book) { this.reading3Book = reading3Book; }
    
    public Integer getReading3Chapter() { return reading3Chapter; }
    public void setReading3Chapter(Integer reading3Chapter) { this.reading3Chapter = reading3Chapter; }
    
    public String getReading4Book() { return reading4Book; }
    public void setReading4Book(String reading4Book) { this.reading4Book = reading4Book; }
    
    public Integer getReading4Chapter() { return reading4Chapter; }
    public void setReading4Chapter(Integer reading4Chapter) { this.reading4Chapter = reading4Chapter; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}