package com.macchain.domain.port;

/**
 * 성경 API 서비스 포트
 */
public interface BibleApiService {
    
    /**
     * 히브리어 원문 가져오기
     */
    String getHebrewText(String book, int chapter, int verse);
    
    /**
     * 그리스어 원문 가져오기
     */
    String getGreekText(String book, int chapter, int verse);
    
    /**
     * 영어 번역 가져오기
     */
    String getEnglishText(String book, int chapter, int verse);
}

