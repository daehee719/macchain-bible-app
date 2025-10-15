package com.macchain.domain.entity;

/**
 * 히브리어 단어 분석 정보
 */
public class WordAnalysis {
    private String word;           // 히브리어 단어
    private String transliteration; // 음성 표기
    private String meaning;        // 단어의 의미
    private String grammar;        // 문법적 특징
    private String significance;   // 구절에서의 중요성

    public WordAnalysis() {}

    public WordAnalysis(String word, String transliteration, String meaning, String grammar, String significance) {
        this.word = word;
        this.transliteration = transliteration;
        this.meaning = meaning;
        this.grammar = grammar;
        this.significance = significance;
    }

    // Getters and Setters
    public String getWord() { return word; }
    public void setWord(String word) { this.word = word; }
    
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
    
    public String getGrammar() { return grammar; }
    public void setGrammar(String grammar) { this.grammar = grammar; }
    
    public String getSignificance() { return significance; }
    public void setSignificance(String significance) { this.significance = significance; }
}

