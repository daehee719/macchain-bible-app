package com.macchain.presentation.mapper;

import com.macchain.domain.entity.UserProgress;
import com.macchain.domain.valueobject.ReadingProgress;
import com.macchain.presentation.dto.ReadingProgressResponse;
import com.macchain.presentation.dto.UserProgressResponse;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * UserProgress 도메인 엔티티를 UserProgressResponse DTO로 변환
 */
@Component
public class UserProgressResponseMapper {
    
    /**
     * 도메인 엔티티를 응답 DTO로 변환
     */
    public UserProgressResponse toResponse(UserProgress domain) {
        if (domain == null) {
            return null;
        }
        
        // ReadingProgress를 ReadingProgressResponse로 변환
        List<ReadingProgressResponse> readingResponses = domain.getReadings().stream()
                .map(this::toReadingProgressResponse)
                .collect(Collectors.toList());
        
        return new UserProgressResponse(
                domain.getId(),
                domain.getUserId(),
                domain.getReadingDate(),
                domain.getDayNumber(),
                readingResponses,
                domain.getCompletedReadings(),
                domain.getTotalReadings(),
                domain.getProgressPercentage(),
                domain.getCreatedAt(),
                domain.getUpdatedAt()
        );
    }
    
    /**
     * ReadingProgress를 ReadingProgressResponse로 변환
     */
    private ReadingProgressResponse toReadingProgressResponse(ReadingProgress reading) {
        return new ReadingProgressResponse(
                reading.getBook(),
                reading.getChapter(),
                reading.isCompleted()
        );
    }
}
