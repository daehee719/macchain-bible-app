package com.macchain.infrastructure.repository;

import com.macchain.domain.entity.UserProgress;
import com.macchain.domain.port.UserProgressRepository;
import com.macchain.infrastructure.entity.UserProgressJpaEntity;
import com.macchain.infrastructure.mapper.UserProgressMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * 사용자 읽기 진행률 JPA Repository 구현
 */
@Repository
public class JpaUserProgressRepository implements UserProgressRepository {
    
    private final UserProgressJpaRepository jpaRepository;
    private final UserProgressMapper mapper;
    
    public JpaUserProgressRepository(UserProgressJpaRepository jpaRepository, UserProgressMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<UserProgress> findByUserIdAndReadingDate(Long userId, LocalDate readingDate) {
        return jpaRepository.findByUserIdAndReadingDate(userId, readingDate)
                .map(mapper::toDomain);
    }
    
    @Override
    public UserProgress save(UserProgress userProgress) {
        UserProgressJpaEntity jpaEntity = mapper.toJpaEntity(userProgress);
        UserProgressJpaEntity savedEntity = jpaRepository.save(jpaEntity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public UserProgress update(UserProgress userProgress) {
        return save(userProgress);
    }
}