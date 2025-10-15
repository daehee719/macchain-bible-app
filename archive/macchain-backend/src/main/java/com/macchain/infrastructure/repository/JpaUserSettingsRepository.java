package com.macchain.infrastructure.repository;

import com.macchain.domain.entity.UserSettings;
import com.macchain.domain.port.UserSettingsRepository;
import com.macchain.infrastructure.entity.UserSettingsJpaEntity;
import com.macchain.infrastructure.mapper.UserSettingsMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 사용자 설정 JPA 저장소 구현
 */
@Repository
public class JpaUserSettingsRepository implements UserSettingsRepository {
    
    private final UserSettingsJpaRepository jpaRepository;
    private final UserSettingsMapper mapper;
    
    public JpaUserSettingsRepository(UserSettingsJpaRepository jpaRepository, UserSettingsMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<UserSettings> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId)
                .map(mapper::toDomain);
    }
    
    @Override
    public UserSettings save(UserSettings userSettings) {
        UserSettingsJpaEntity jpaEntity = mapper.toJpaEntity(userSettings);
        UserSettingsJpaEntity savedEntity = jpaRepository.save(jpaEntity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public UserSettings update(UserSettings userSettings) {
        userSettings.setUpdatedAt(LocalDateTime.now());
        UserSettingsJpaEntity jpaEntity = mapper.toJpaEntity(userSettings);
        UserSettingsJpaEntity savedEntity = jpaRepository.save(jpaEntity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public void deleteByUserId(Long userId) {
        jpaRepository.deleteByUserId(userId);
    }
}

