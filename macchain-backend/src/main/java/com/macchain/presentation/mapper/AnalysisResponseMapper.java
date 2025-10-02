package com.macchain.presentation.mapper;

import com.macchain.domain.entity.AnalysisResult;
import com.macchain.presentation.dto.AnalysisResponse;
import org.springframework.stereotype.Component;

/**
 * 분석 결과 응답 매퍼
 */
@Component
public class AnalysisResponseMapper {
    
    /**
     * 도메인 엔티티를 응답 DTO로 변환
     */
    public AnalysisResponse toResponse(AnalysisResult result) {
        if (result == null) {
            return AnalysisResponse.error("분석 결과가 없습니다.");
        }
        
        return new AnalysisResponse(
                true,
                "원어분석이 완료되었습니다.",
                result.getBook(),
                result.getChapter(),
                result.getVerse(),
                result.getHebrewText(),
                result.getWordAnalysis(),
                result.getOverallMeaning(),
                result.getCulturalBackground(),
                result.getPracticalApplication(),
                result.getKeyWords()
        );
    }
}
