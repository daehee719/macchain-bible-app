package com.macchain.domain.port;

import com.macchain.domain.entity.UserProgress;
import java.time.LocalDate;
import java.util.Optional;

/**
 * 사용자 읽기 진행률 저장소 포트
 */
public interface UserProgressRepository {
    
    /**
     * 사용자 ID와 날짜로 진행률 조회
     */
    Optional<UserProgress> findByUserIdAndReadingDate(Long userId, LocalDate readingDate);
    
    /**
     * 사용자 읽기 진행률 저장
     */
    UserProgress save(UserProgress userProgress);
    
    /**
     * 사용자 읽기 진행률 업데이트
     */
    UserProgress update(UserProgress userProgress);
}