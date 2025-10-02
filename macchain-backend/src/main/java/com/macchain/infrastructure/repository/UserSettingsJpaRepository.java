package com.macchain.infrastructure.repository;

import com.macchain.infrastructure.entity.UserSettingsJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 사용자 설정 JPA Repository
 */
@Repository
public interface UserSettingsJpaRepository extends JpaRepository<UserSettingsJpaEntity, Long> {
    
    /**
     * 사용자 ID로 설정 조회
     */
    Optional<UserSettingsJpaEntity> findByUserId(Long userId);
    
    /**
     * 사용자 ID로 설정 삭제
     */
    void deleteByUserId(Long userId);
}

