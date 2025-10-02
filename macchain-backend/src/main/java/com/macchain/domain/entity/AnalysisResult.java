package com.macchain.domain.entity;

import java.util.List;

/**
 * 원어 분석 결과 도메인 엔티티 - 통일된 구조
 */
public class AnalysisResult {
    private String book;
    private int chapter;
    private int verse;
    private String hebrewText;
    private List<WordAnalysis> wordAnalysis;
    private String overallMeaning;
    private String culturalBackground;
    private String practicalApplication;
    private List<String> keyWords;
    
    // 기본 생성자
    public AnalysisResult() {}
    
    // 전체 생성자
    public AnalysisResult(String book, int chapter, int verse, String hebrewText, 
                         List<WordAnalysis> wordAnalysis, String overallMeaning, 
                         String culturalBackground, String practicalApplication, List<String> keyWords) {
        this.book = book;
        this.chapter = chapter;
        this.verse = verse;
        this.hebrewText = hebrewText;
        this.wordAnalysis = wordAnalysis;
        this.overallMeaning = overallMeaning;
        this.culturalBackground = culturalBackground;
        this.practicalApplication = practicalApplication;
        this.keyWords = keyWords;
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
    
    public List<WordAnalysis> getWordAnalysis() {
        return wordAnalysis;
    }
    
    public void setWordAnalysis(List<WordAnalysis> wordAnalysis) {
        this.wordAnalysis = wordAnalysis;
    }
    
    public String getOverallMeaning() {
        return overallMeaning;
    }
    
    public void setOverallMeaning(String overallMeaning) {
        this.overallMeaning = overallMeaning;
    }
    
    public String getCulturalBackground() {
        return culturalBackground;
    }
    
    public void setCulturalBackground(String culturalBackground) {
        this.culturalBackground = culturalBackground;
    }
    
    public String getPracticalApplication() {
        return practicalApplication;
    }
    
    public void setPracticalApplication(String practicalApplication) {
        this.practicalApplication = practicalApplication;
    }
    
    public List<String> getKeyWords() {
        return keyWords;
    }
    
    public void setKeyWords(List<String> keyWords) {
        this.keyWords = keyWords;
    }
    
    @Override
    public String toString() {
        return "AnalysisResult{" +
                "book='" + book + '\'' +
                ", chapter=" + chapter +
                ", verse=" + verse +
                ", hebrewText='" + hebrewText + '\'' +
                ", wordAnalysis=" + wordAnalysis +
                ", overallMeaning='" + overallMeaning + '\'' +
                ", culturalBackground='" + culturalBackground + '\'' +
                ", practicalApplication='" + practicalApplication + '\'' +
                ", keyWords=" + keyWords +
                '}';
    }
}
