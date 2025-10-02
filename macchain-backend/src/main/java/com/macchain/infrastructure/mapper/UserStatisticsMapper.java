package com.macchain.infrastructure.mapper;

import com.macchain.domain.entity.UserStatistics;
import com.macchain.infrastructure.entity.UserStatisticsJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class UserStatisticsMapper {
    
    public UserStatisticsJpaEntity toJpaEntity(UserStatistics domain) {
        if (domain == null) {
            return null;
        }
        
        UserStatisticsJpaEntity jpaEntity = new UserStatisticsJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setStatisticsDate(domain.getStatisticsDate());
        jpaEntity.setTotalDaysRead(domain.getTotalDaysRead());
        jpaEntity.setConsecutiveDays(domain.getConsecutiveDays());
        jpaEntity.setTotalChaptersRead(domain.getTotalChaptersRead());
        jpaEntity.setAverageProgress(domain.getAverageProgress());
        jpaEntity.setPerfectDays(domain.getPerfectDays());
        jpaEntity.setCurrentMonthDays(domain.getCurrentMonthDays());
        jpaEntity.setCurrentMonthChapters(domain.getCurrentMonthChapters());
        jpaEntity.setCurrentMonthProgress(domain.getCurrentMonthProgress());
        jpaEntity.setCurrentYearDays(domain.getCurrentYearDays());
        jpaEntity.setCurrentYearChapters(domain.getCurrentYearChapters());
        jpaEntity.setCurrentYearProgress(domain.getCurrentYearProgress());
        jpaEntity.setLongestStreak(domain.getLongestStreak());
        jpaEntity.setLongestStreakStart(domain.getLongestStreakStart());
        jpaEntity.setLongestStreakEnd(domain.getLongestStreakEnd());
        jpaEntity.setLast7Days(domain.getLast7Days());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
    
    public UserStatistics toDomain(UserStatisticsJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        UserStatistics domain = new UserStatistics();
        domain.setId(jpaEntity.getId());
        domain.setUserId(jpaEntity.getUserId());
        domain.setStatisticsDate(jpaEntity.getStatisticsDate());
        domain.setTotalDaysRead(jpaEntity.getTotalDaysRead());
        domain.setConsecutiveDays(jpaEntity.getConsecutiveDays());
        domain.setTotalChaptersRead(jpaEntity.getTotalChaptersRead());
        domain.setAverageProgress(jpaEntity.getAverageProgress());
        domain.setPerfectDays(jpaEntity.getPerfectDays());
        domain.setCurrentMonthDays(jpaEntity.getCurrentMonthDays());
        domain.setCurrentMonthChapters(jpaEntity.getCurrentMonthChapters());
        domain.setCurrentMonthProgress(jpaEntity.getCurrentMonthProgress());
        domain.setCurrentYearDays(jpaEntity.getCurrentYearDays());
        domain.setCurrentYearChapters(jpaEntity.getCurrentYearChapters());
        domain.setCurrentYearProgress(jpaEntity.getCurrentYearProgress());
        domain.setLongestStreak(jpaEntity.getLongestStreak());
        domain.setLongestStreakStart(jpaEntity.getLongestStreakStart());
        domain.setLongestStreakEnd(jpaEntity.getLongestStreakEnd());
        domain.setLast7Days(jpaEntity.getLast7Days());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());
        
        return domain;
    }
}

