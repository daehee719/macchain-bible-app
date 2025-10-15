package com.macchain.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.util.List;

/**
 * 구절 원어분석 MongoDB 문서
 * AI가 분석한 구절별 원어분석 결과를 저장
 */
@Document(collection = "verse_analysis")
public class VerseAnalysisDocument {
    
    @Id
    private String id;
    
    @Indexed
    private String book;
    
    @Indexed
    private Integer chapter;
    
    @Indexed
    private Integer verse;
    
    private String hebrewText;
    private List<com.macchain.domain.entity.WordAnalysis> wordAnalysis;
    private String aiExplanation;
    private String grammaticalAnalysis;
    private String culturalContext;
    private List<String> keyWords;
    
    @Indexed
    private LocalDate analysisDate;
    
    private LocalDate createdAt;
    
    // Constructors
    public VerseAnalysisDocument() {
        this.createdAt = LocalDate.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getBook() { return book; }
    public void setBook(String book) { this.book = book; }
    
    public Integer getChapter() { return chapter; }
    public void setChapter(Integer chapter) { this.chapter = chapter; }
    
    public Integer getVerse() { return verse; }
    public void setVerse(Integer verse) { this.verse = verse; }
    
    public String getHebrewText() { return hebrewText; }
    public void setHebrewText(String hebrewText) { this.hebrewText = hebrewText; }
    
    public List<com.macchain.domain.entity.WordAnalysis> getWordAnalysis() { return wordAnalysis; }
    public void setWordAnalysis(List<com.macchain.domain.entity.WordAnalysis> wordAnalysis) { this.wordAnalysis = wordAnalysis; }
    
    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }
    
    public String getGrammaticalAnalysis() { return grammaticalAnalysis; }
    public void setGrammaticalAnalysis(String grammaticalAnalysis) { this.grammaticalAnalysis = grammaticalAnalysis; }
    
    public String getCulturalContext() { return culturalContext; }
    public void setCulturalContext(String culturalContext) { this.culturalContext = culturalContext; }
    
    public List<String> getKeyWords() { return keyWords; }
    public void setKeyWords(List<String> keyWords) { this.keyWords = keyWords; }
    
    public LocalDate getAnalysisDate() { return analysisDate; }
    public void setAnalysisDate(LocalDate analysisDate) { this.analysisDate = analysisDate; }
    
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    
}
