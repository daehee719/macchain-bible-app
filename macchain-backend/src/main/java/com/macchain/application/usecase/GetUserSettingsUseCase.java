package com.macchain.application.usecase;

import com.macchain.domain.entity.UserSettings;
import com.macchain.domain.port.UserSettingsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 사용자 설정 조회 유스케이스
 */
@Service
public class GetUserSettingsUseCase {
    
    private final UserSettingsRepository userSettingsRepository;
    
    public GetUserSettingsUseCase(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }
    
    /**
     * 사용자 설정 조회 (없으면 기본 설정 생성)
     */
    public UserSettings execute(Long userId) {
        Optional<UserSettings> existingSettings = userSettingsRepository.findByUserId(userId);
        
        if (existingSettings.isPresent()) {
            return existingSettings.get();
        } else {
            // 기본 설정 생성
            UserSettings defaultSettings = new UserSettings(userId);
            return userSettingsRepository.save(defaultSettings);
        }
    }
}

