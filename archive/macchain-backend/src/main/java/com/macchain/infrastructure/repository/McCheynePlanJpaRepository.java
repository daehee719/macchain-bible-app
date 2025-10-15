package com.macchain.infrastructure.repository;

import com.macchain.infrastructure.entity.McCheynePlanJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA Repository 인터페이스
 */
@Repository
public interface McCheynePlanJpaRepository extends JpaRepository<McCheynePlanJpaEntity, Long> {
    
    Optional<McCheynePlanJpaEntity> findByDayNumber(Integer dayNumber);
    
    boolean existsByDayNumber(Integer dayNumber);
}

