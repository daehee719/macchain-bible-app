package com.macchain.infrastructure.mapper;

import com.macchain.domain.entity.UserProgress;
import com.macchain.infrastructure.entity.UserProgressJpaEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * UserProgress 도메인 엔티티와 JPA 엔티티 간 매핑
 */
@Component
public class UserProgressMapper {
    
    /**
     * JPA 엔티티를 도메인 엔티티로 변환
     */
    public UserProgress toDomain(UserProgressJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        return new UserProgress(
                jpaEntity.getId(),
                jpaEntity.getUserId(),
                jpaEntity.getReadingDate(),
                jpaEntity.getDayNumber(),
                jpaEntity.getReadings(), // readings 필드 매핑
                jpaEntity.getCompletedReadings(),
                jpaEntity.getTotalReadings(),
                jpaEntity.getProgressPercentage(),
                jpaEntity.getCreatedAt(),
                jpaEntity.getUpdatedAt()
        );
    }
    
    /**
     * 도메인 엔티티를 JPA 엔티티로 변환
     */
    public UserProgressJpaEntity toJpaEntity(UserProgress domain) {
        if (domain == null) {
            return null;
        }
        
        UserProgressJpaEntity jpaEntity = new UserProgressJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setReadingDate(domain.getReadingDate());
        jpaEntity.setDayNumber(domain.getDayNumber());
        jpaEntity.setReadings(domain.getReadings()); // readings 필드 매핑
        jpaEntity.setCompletedReadings(domain.getCompletedReadings());
        jpaEntity.setTotalReadings(domain.getTotalReadings());
        jpaEntity.setProgressPercentage(domain.getProgressPercentage());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());
        
        return jpaEntity;
    }
}
