package com.macchain.presentation.dto;

/**
 * AI 분석 요청 DTO
 */
public class AnalysisRequest {
    private String book;
    private int chapter;
    private int verse;
    private String hebrewText;
    private String englishText;

    // 기본 생성자
    public AnalysisRequest() {}

    // 전체 생성자
    public AnalysisRequest(String book, int chapter, int verse, String hebrewText, String englishText) {
        this.book = book;
        this.chapter = chapter;
        this.verse = verse;
        this.hebrewText = hebrewText;
        this.englishText = englishText;
    }

    // Getters and Setters
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

    public int getVerse() {
        return verse;
    }

    public void setVerse(int verse) {
        this.verse = verse;
    }

    public String getHebrewText() {
        return hebrewText;
    }

    public void setHebrewText(String hebrewText) {
        this.hebrewText = hebrewText;
    }

    public String getEnglishText() {
        return englishText;
    }

    public void setEnglishText(String englishText) {
        this.englishText = englishText;
    }

    @Override
    public String toString() {
        return "AnalysisRequest{" +
                "book='" + book + '\'' +
                ", chapter=" + chapter +
                ", verse=" + verse +
                ", hebrewText='" + hebrewText + '\'' +
                ", englishText='" + englishText + '\'' +
                '}';
    }
}

