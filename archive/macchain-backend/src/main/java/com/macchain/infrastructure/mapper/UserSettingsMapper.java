package com.macchain.infrastructure.mapper;

import com.macchain.domain.entity.UserSettings;
import com.macchain.infrastructure.entity.UserSettingsJpaEntity;
import org.springframework.stereotype.Component;

/**
 * 사용자 설정 매퍼
 */
@Component
public class UserSettingsMapper {
    
    /**
     * JPA 엔티티를 도메인 엔티티로 변환
     */
    public UserSettings toDomain(UserSettingsJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }
        
        return new UserSettings(
            jpaEntity.getId(),
            jpaEntity.getUserId(),
            jpaEntity.getTheme(),
            jpaEntity.isEmailNotifications(),
            jpaEntity.isPushNotifications(),
            jpaEntity.getReadingReminderTime(),
            jpaEntity.getLanguage(),
            jpaEntity.isShowOriginalText(),
            jpaEntity.isAutoPlayAudio(),
            jpaEntity.getFontSize(),
            jpaEntity.getCreatedAt(),
            jpaEntity.getUpdatedAt()
        );
    }
    
    /**
     * 도메인 엔티티를 JPA 엔티티로 변환
     */
    public UserSettingsJpaEntity toJpaEntity(UserSettings domainEntity) {
        if (domainEntity == null) {
            return null;
        }
        
        return new UserSettingsJpaEntity(
            domainEntity.getId(),
            domainEntity.getUserId(),
            domainEntity.getTheme(),
            domainEntity.isEmailNotifications(),
            domainEntity.isPushNotifications(),
            domainEntity.getReadingReminderTime(),
            domainEntity.getLanguage(),
            domainEntity.isShowOriginalText(),
            domainEntity.isAutoPlayAudio(),
            domainEntity.getFontSize(),
            domainEntity.getCreatedAt(),
            domainEntity.getUpdatedAt()
        );
    }
}

