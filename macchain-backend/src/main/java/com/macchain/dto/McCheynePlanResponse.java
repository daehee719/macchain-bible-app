package com.macchain.dto;

import java.time.LocalDateTime;

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
        
        public Reading(String book, Integer chapter) {
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
    
    public McCheynePlanResponse(Long id, Integer dayNumber, 
                               String reading1Book, Integer reading1Chapter,
                               String reading2Book, Integer reading2Chapter,
                               String reading3Book, Integer reading3Chapter,
                               String reading4Book, Integer reading4Chapter,
                               LocalDateTime createdAt) {
        this.id = id;
        this.dayNumber = dayNumber;
        this.reading1 = new Reading(reading1Book, reading1Chapter);
        this.reading2 = new Reading(reading2Book, reading2Chapter);
        this.reading3 = new Reading(reading3Book, reading3Chapter);
        this.reading4 = new Reading(reading4Book, reading4Chapter);
        this.createdAt = createdAt;
    }
    
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

