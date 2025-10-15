package com.macchain.presentation.mapper;

import com.macchain.domain.entity.UserStatistics;
import com.macchain.presentation.dto.UserStatisticsResponse;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserStatisticsResponseMapper {
    
    public UserStatisticsResponse toResponse(UserStatistics domain) {
        if (domain == null) {
            return null;
        }
        
        UserStatisticsResponse response = new UserStatisticsResponse();
        response.setId(domain.getId());
        response.setUserId(domain.getUserId());
        response.setStatisticsDate(domain.getStatisticsDate());
        response.setTotalDaysRead(domain.getTotalDaysRead());
        response.setConsecutiveDays(domain.getConsecutiveDays());
        response.setTotalChaptersRead(domain.getTotalChaptersRead());
        response.setAverageProgress(domain.getAverageProgress());
        response.setPerfectDays(domain.getPerfectDays());
        response.setCurrentMonthDays(domain.getCurrentMonthDays());
        response.setCurrentMonthChapters(domain.getCurrentMonthChapters());
        response.setCurrentMonthProgress(domain.getCurrentMonthProgress());
        response.setCurrentYearDays(domain.getCurrentYearDays());
        response.setCurrentYearChapters(domain.getCurrentYearChapters());
        response.setCurrentYearProgress(domain.getCurrentYearProgress());
        response.setLongestStreak(domain.getLongestStreak());
        response.setLongestStreakStart(domain.getLongestStreakStart());
        response.setLongestStreakEnd(domain.getLongestStreakEnd());
        response.setLast7Days(domain.getLast7Days() != null ? 
            domain.getLast7Days().stream()
                .map(this::toDailyProgressResponse)
                .collect(Collectors.toList()) : null);
        response.setCreatedAt(domain.getCreatedAt());
        response.setUpdatedAt(domain.getUpdatedAt());
        
        return response;
    }
    
    private UserStatisticsResponse.DailyProgressResponse toDailyProgressResponse(UserStatistics.DailyProgress domain) {
        if (domain == null) {
            return null;
        }
        
        UserStatisticsResponse.DailyProgressResponse response = new UserStatisticsResponse.DailyProgressResponse();
        response.setDate(domain.getDate());
        response.setChaptersRead(domain.getChaptersRead());
        response.setProgressPercentage(domain.getProgressPercentage());
        response.setCompleted(domain.isCompleted());
        
        return response;
    }
}

