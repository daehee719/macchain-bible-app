package com.macchain.presentation.mapper;

import com.macchain.domain.entity.UserSettings;
import com.macchain.presentation.dto.UserSettingsResponse;
import org.springframework.stereotype.Component;

/**
 * 사용자 설정 응답 매퍼
 */
@Component
public class UserSettingsResponseMapper {
    
    /**
     * 도메인 엔티티를 응답 DTO로 변환
     */
    public UserSettingsResponse toResponse(UserSettings userSettings) {
        if (userSettings == null) {
            return null;
        }
        
        return new UserSettingsResponse(
            userSettings.getId(),
            userSettings.getUserId(),
            userSettings.getTheme(),
            userSettings.isEmailNotifications(),
            userSettings.isPushNotifications(),
            userSettings.getReadingReminderTime(),
            userSettings.getLanguage(),
            userSettings.isShowOriginalText(),
            userSettings.isAutoPlayAudio(),
            userSettings.getFontSize(),
            userSettings.getCreatedAt(),
            userSettings.getUpdatedAt()
        );
    }
}

