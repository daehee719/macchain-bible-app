package com.macchain.infrastructure.repository;

import com.macchain.domain.entity.ReadingPlan;
import com.macchain.domain.port.ReadingPlanRepository;
import com.macchain.infrastructure.entity.McCheynePlanJpaEntity;
import com.macchain.infrastructure.mapper.ReadingPlanMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * JPA 기반 읽기 계획 저장소 구현
 */
@Repository
public class JpaReadingPlanRepository implements ReadingPlanRepository {
    
    private final McCheynePlanJpaRepository jpaRepository;
    private final ReadingPlanMapper mapper;
    
    public JpaReadingPlanRepository(McCheynePlanJpaRepository jpaRepository, 
                                   ReadingPlanMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<ReadingPlan> findByDayNumber(Integer dayNumber) {
        return jpaRepository.findByDayNumber(dayNumber)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<ReadingPlan> findTodayPlan() {
        // 오늘의 계획은 애플리케이션 레이어에서 계산
        return Optional.empty();
    }
    
    @Override
    public List<ReadingPlan> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public ReadingPlan save(ReadingPlan readingPlan) {
        McCheynePlanJpaEntity entity = mapper.toJpa(readingPlan);
        McCheynePlanJpaEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public boolean existsByDayNumber(Integer dayNumber) {
        return jpaRepository.existsByDayNumber(dayNumber);
    }
}

