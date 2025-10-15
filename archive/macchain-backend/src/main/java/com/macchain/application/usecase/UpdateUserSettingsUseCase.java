package com.macchain.application.usecase;

import com.macchain.domain.entity.UserSettings;
import com.macchain.domain.port.UserSettingsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 사용자 설정 업데이트 유스케이스
 */
@Service
public class UpdateUserSettingsUseCase {
    
    private final UserSettingsRepository userSettingsRepository;
    
    public UpdateUserSettingsUseCase(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }
    
    /**
     * 사용자 설정 업데이트
     */
    public UserSettings execute(Long userId, String theme, boolean emailNotifications,
                               boolean pushNotifications, String readingReminderTime,
                               String language, boolean showOriginalText,
                               boolean autoPlayAudio, String fontSize) {
        
        // 기존 설정 조회 또는 기본 설정 생성
        UserSettings existingSettings = userSettingsRepository.findByUserId(userId)
                .orElse(new UserSettings(userId));
        
        // 설정 업데이트
        existingSettings.setTheme(theme);
        existingSettings.setEmailNotifications(emailNotifications);
        existingSettings.setPushNotifications(pushNotifications);
        existingSettings.setReadingReminderTime(readingReminderTime);
        existingSettings.setLanguage(language);
        existingSettings.setShowOriginalText(showOriginalText);
        existingSettings.setAutoPlayAudio(autoPlayAudio);
        existingSettings.setFontSize(fontSize);
        existingSettings.setUpdatedAt(LocalDateTime.now());
        
        return userSettingsRepository.update(existingSettings);
    }
}

