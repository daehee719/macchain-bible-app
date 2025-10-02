package com.macchain.application.usecase;

import com.macchain.domain.entity.UserProgress;
import com.macchain.domain.port.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

/**
 * 사용자 읽기 진행률 조회 유스케이스
 */
@Service
public class GetUserProgressUseCase {
    
    private final UserProgressRepository userProgressRepository;
    
    public GetUserProgressUseCase(UserProgressRepository userProgressRepository) {
        this.userProgressRepository = userProgressRepository;
    }
    
    /**
     * 사용자의 오늘 읽기 진행률 조회
     */
    public Optional<UserProgress> execute(Long userId) {
        LocalDate today = LocalDate.now();
        return userProgressRepository.findByUserIdAndReadingDate(userId, today);
    }
    
    /**
     * 사용자의 특정 날짜 읽기 진행률 조회
     */
    public Optional<UserProgress> execute(Long userId, LocalDate date) {
        return userProgressRepository.findByUserIdAndReadingDate(userId, date);
    }
}

