package com.macchain.presentation.controller;

import com.macchain.application.usecase.GetUserSettingsUseCase;
import com.macchain.application.usecase.UpdateUserSettingsUseCase;
import com.macchain.domain.entity.UserSettings;
import com.macchain.presentation.dto.UserSettingsRequest;
import com.macchain.presentation.dto.UserSettingsResponse;
import com.macchain.presentation.mapper.UserSettingsResponseMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 설정 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3003"})
public class UserSettingsController {
    
    private final GetUserSettingsUseCase getUserSettingsUseCase;
    private final UpdateUserSettingsUseCase updateUserSettingsUseCase;
    private final UserSettingsResponseMapper responseMapper;
    
    public UserSettingsController(GetUserSettingsUseCase getUserSettingsUseCase,
                                 UpdateUserSettingsUseCase updateUserSettingsUseCase,
                                 UserSettingsResponseMapper responseMapper) {
        this.getUserSettingsUseCase = getUserSettingsUseCase;
        this.updateUserSettingsUseCase = updateUserSettingsUseCase;
        this.responseMapper = responseMapper;
    }
    
    /**
     * 사용자 설정 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserSettingsResponse> getUserSettings(@PathVariable Long userId) {
        try {
            UserSettings settings = getUserSettingsUseCase.execute(userId);
            UserSettingsResponse response = responseMapper.toResponse(settings);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 사용자 설정 업데이트
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UserSettingsResponse> updateUserSettings(
            @PathVariable Long userId,
            @RequestBody UserSettingsRequest request) {
        try {
            UserSettings updatedSettings = updateUserSettingsUseCase.execute(
                userId,
                request.getTheme(),
                request.isEmailNotifications(),
                request.isPushNotifications(),
                request.getReadingReminderTime(),
                request.getLanguage(),
                request.isShowOriginalText(),
                request.isAutoPlayAudio(),
                request.getFontSize()
            );
            
            UserSettingsResponse response = responseMapper.toResponse(updatedSettings);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
