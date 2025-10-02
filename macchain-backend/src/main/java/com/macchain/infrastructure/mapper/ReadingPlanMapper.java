package com.macchain.infrastructure.mapper;

import com.macchain.domain.entity.ReadingPlan;
import com.macchain.domain.valueobject.Reading;
import com.macchain.infrastructure.entity.McCheynePlanJpaEntity;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * 도메인 엔티티와 JPA 엔티티 간 매핑
 */
@Component
public class ReadingPlanMapper {
    
    /**
     * JPA 엔티티를 도메인 엔티티로 변환
     */
    public ReadingPlan toDomain(McCheynePlanJpaEntity jpaEntity) {
        List<Reading> readings = Arrays.asList(
                new Reading(jpaEntity.getReading1Book(), jpaEntity.getReading1Chapter()),
                new Reading(jpaEntity.getReading2Book(), jpaEntity.getReading2Chapter()),
                new Reading(jpaEntity.getReading3Book(), jpaEntity.getReading3Chapter()),
                new Reading(jpaEntity.getReading4Book(), jpaEntity.getReading4Chapter())
        );
        
        ReadingPlan domain = new ReadingPlan(
                jpaEntity.getId(),
                jpaEntity.getDayNumber(),
                readings
        );
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        
        return domain;
    }
    
    /**
     * 도메인 엔티티를 JPA 엔티티로 변환
     */
    public McCheynePlanJpaEntity toJpa(ReadingPlan domain) {
        McCheynePlanJpaEntity jpaEntity = new McCheynePlanJpaEntity();
        
        jpaEntity.setId(domain.getId());
        jpaEntity.setDayNumber(domain.getDayNumber());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        
        List<Reading> readings = domain.getReadings();
        if (readings.size() >= 4) {
            jpaEntity.setReading1Book(readings.get(0).getBook());
            jpaEntity.setReading1Chapter(readings.get(0).getChapter());
            jpaEntity.setReading2Book(readings.get(1).getBook());
            jpaEntity.setReading2Chapter(readings.get(1).getChapter());
            jpaEntity.setReading3Book(readings.get(2).getBook());
            jpaEntity.setReading3Chapter(readings.get(2).getChapter());
            jpaEntity.setReading4Book(readings.get(3).getBook());
            jpaEntity.setReading4Chapter(readings.get(3).getChapter());
        }
        
        return jpaEntity;
    }
}

