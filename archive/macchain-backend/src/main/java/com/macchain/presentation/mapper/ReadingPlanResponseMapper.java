package com.macchain.presentation.mapper;

import com.macchain.domain.entity.ReadingPlan;
import com.macchain.domain.valueobject.Reading;
import com.macchain.presentation.dto.McCheynePlanResponse;
import org.springframework.stereotype.Component;

/**
 * 도메인 엔티티를 응답 DTO로 변환
 */
@Component
public class ReadingPlanResponseMapper {
    
    public McCheynePlanResponse toResponse(ReadingPlan domain) {
        McCheynePlanResponse response = new McCheynePlanResponse();
        
        response.setId(domain.getId());
        response.setDayNumber(domain.getDayNumber());
        response.setCreatedAt(domain.getCreatedAt());
        
        // 읽기 항목들을 응답 DTO로 변환
        if (domain.getReadings().size() >= 4) {
            Reading reading1 = domain.getReadings().get(0);
            Reading reading2 = domain.getReadings().get(1);
            Reading reading3 = domain.getReadings().get(2);
            Reading reading4 = domain.getReadings().get(3);
            
            response.setReading1(new McCheynePlanResponse.Reading(
                    reading1.getBook(), reading1.getChapter()));
            response.setReading2(new McCheynePlanResponse.Reading(
                    reading2.getBook(), reading2.getChapter()));
            response.setReading3(new McCheynePlanResponse.Reading(
                    reading3.getBook(), reading3.getChapter()));
            response.setReading4(new McCheynePlanResponse.Reading(
                    reading4.getBook(), reading4.getChapter()));
        }
        
        return response;
    }
}

