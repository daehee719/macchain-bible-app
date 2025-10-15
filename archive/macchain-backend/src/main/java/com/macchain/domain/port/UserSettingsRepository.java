package com.macchain.domain.port;

import com.macchain.domain.entity.UserSettings;
import java.util.Optional;

/**
 * 사용자 설정 저장소 포트
 */
public interface UserSettingsRepository {
    
    /**
     * 사용자 ID로 설정 조회
     */
    Optional<UserSettings> findByUserId(Long userId);
    
    /**
     * 사용자 설정 저장
     */
    UserSettings save(UserSettings userSettings);
    
    /**
     * 사용자 설정 업데이트
     */
    UserSettings update(UserSettings userSettings);
    
    /**
     * 사용자 설정 삭제
     */
    void deleteByUserId(Long userId);
}

