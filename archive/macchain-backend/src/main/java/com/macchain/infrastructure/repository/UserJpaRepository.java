package com.macchain.infrastructure.repository;

import com.macchain.infrastructure.entity.UserJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 사용자 JPA 저장소
 */
@Repository
public interface UserJpaRepository extends JpaRepository<UserJpaEntity, Long> {
    
    Optional<UserJpaEntity> findByEmail(String email);
    
    Optional<UserJpaEntity> findByNickname(String nickname);
    
    boolean existsByEmail(String email);
    
    boolean existsByNickname(String nickname);
}

