package com.macchain.presentation.dto;

import java.time.LocalDateTime;

/**
 * 개별 읽기 진행률 응답 DTO
 */
public class ReadingProgressResponse {
    private Long id;
    private Long userProgressId;
    private String book;
    private int chapter;
    private boolean completed;
    private LocalDateTime completedAt;
    private int readingTimeMinutes;
    private String notes;

    // 기본 생성자
    public ReadingProgressResponse() {}

    // 간단한 생성자 (value object용)
    public ReadingProgressResponse(String book, int chapter, boolean completed) {
        this.book = book;
        this.chapter = chapter;
        this.completed = completed;
    }

    // 전체 생성자
    public ReadingProgressResponse(Long id, Long userProgressId, String book, int chapter,
                                  boolean completed, LocalDateTime completedAt, int readingTimeMinutes, String notes) {
        this.id = id;
        this.userProgressId = userProgressId;
        this.book = book;
        this.chapter = chapter;
        this.completed = completed;
        this.completedAt = completedAt;
        this.readingTimeMinutes = readingTimeMinutes;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserProgressId() {
        return userProgressId;
    }

    public void setUserProgressId(Long userProgressId) {
        this.userProgressId = userProgressId;
    }

    public String getBook() {
        return book;
    }

    public void setBook(String book) {
        this.book = book;
    }

    public int getChapter() {
        return chapter;
    }

    public void setChapter(int chapter) {
        this.chapter = chapter;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public int getReadingTimeMinutes() {
        return readingTimeMinutes;
    }

    public void setReadingTimeMinutes(int readingTimeMinutes) {
        this.readingTimeMinutes = readingTimeMinutes;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "ReadingProgressResponse{" +
                "id=" + id +
                ", userProgressId=" + userProgressId +
                ", book='" + book + '\'' +
                ", chapter=" + chapter +
                ", completed=" + completed +
                ", completedAt=" + completedAt +
                ", readingTimeMinutes=" + readingTimeMinutes +
                ", notes='" + notes + '\'' +
                '}';
    }
}
