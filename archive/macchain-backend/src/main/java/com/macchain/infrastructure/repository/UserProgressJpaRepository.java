package com.macchain.infrastructure.repository;

import com.macchain.infrastructure.entity.UserProgressJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * 사용자 읽기 진행률 JPA Repository
 */
@Repository
public interface UserProgressJpaRepository extends JpaRepository<UserProgressJpaEntity, Long> {
    
    /**
     * 사용자 ID와 읽기 날짜로 진행률 조회
     */
    Optional<UserProgressJpaEntity> findByUserIdAndReadingDate(Long userId, LocalDate readingDate);
}

