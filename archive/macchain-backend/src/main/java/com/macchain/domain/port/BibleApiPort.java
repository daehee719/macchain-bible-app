package com.macchain.domain.port;

import com.macchain.domain.valueobject.Reading;
import java.util.List;

/**
 * 성경 API 포트 (외부 API 연동)
 */
public interface BibleApiPort {
    
    /**
     * 특정 읽기 항목의 성경 내용 조회
     */
    BibleContent getBibleContent(Reading reading, String version);
    
    /**
     * 여러 읽기 항목의 성경 내용 배치 조회
     */
    List<BibleContent> getBibleContents(List<Reading> readings, String version);
    
    /**
     * 사용 가능한 성경 버전 목록 조회
     */
    List<String> getAvailableVersions();
    
    /**
     * 성경 내용 DTO
     */
    class BibleContent {
        private final String book;
        private final Integer chapter;
        private final String version;
        private final List<BibleVerse> verses;
        private final String summary;
        
        public BibleContent(String book, Integer chapter, String version, 
                          List<BibleVerse> verses, String summary) {
            this.book = book;
            this.chapter = chapter;
            this.version = version;
            this.verses = verses;
            this.summary = summary;
        }
        
        // Getters
        public String getBook() { return book; }
        public Integer getChapter() { return chapter; }
        public String getVersion() { return version; }
        public List<BibleVerse> getVerses() { return verses; }
        public String getSummary() { return summary; }
    }
    
    /**
     * 성경 절 DTO
     */
    class BibleVerse {
        private final Integer verse;
        private final String text;
        
        public BibleVerse(Integer verse, String text) {
            this.verse = verse;
            this.text = text;
        }
        
        // Getters
        public Integer getVerse() { return verse; }
        public String getText() { return text; }
    }
}

