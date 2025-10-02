package com.macchain.presentation.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * 읽기 계획 응답 DTO
 */
public class McCheynePlanResponse {
    private Long id;
    private Integer dayNumber;
    private Reading reading1;
    private Reading reading2;
    private Reading reading3;
    private Reading reading4;
    private LocalDateTime createdAt;
    
    public static class Reading {
        private String book;
        private Integer chapter;
        
        public Reading() {}
        
        @JsonCreator
        public Reading(@JsonProperty("book") String book, @JsonProperty("chapter") Integer chapter) {
            this.book = book;
            this.chapter = chapter;
        }
        
        public String getBook() { return book; }
        public void setBook(String book) { this.book = book; }
        
        public Integer getChapter() { return chapter; }
        public void setChapter(Integer chapter) { this.chapter = chapter; }
    }
    
    // Constructors
    public McCheynePlanResponse() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
    
    public Reading getReading1() { return reading1; }
    public void setReading1(Reading reading1) { this.reading1 = reading1; }
    
    public Reading getReading2() { return reading2; }
    public void setReading2(Reading reading2) { this.reading2 = reading2; }
    
    public Reading getReading3() { return reading3; }
    public void setReading3(Reading reading3) { this.reading3 = reading3; }
    
    public Reading getReading4() { return reading4; }
    public void setReading4(Reading reading4) { this.reading4 = reading4; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
