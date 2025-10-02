package com.macchain.application.usecase;

import com.macchain.domain.entity.UserProgress;
import com.macchain.domain.port.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 사용자 읽기 진행률 업데이트 유스케이스
 */
@Service
public class UpdateUserProgressUseCase {
    
    private final UserProgressRepository userProgressRepository;
    
    public UpdateUserProgressUseCase(UserProgressRepository userProgressRepository) {
        this.userProgressRepository = userProgressRepository;
    }
    
    /**
     * 읽기 완료 상태 업데이트
     */
    public UserProgress execute(Long userId, String readingId, boolean completed) {
        LocalDate today = LocalDate.now();
        
        // 오늘의 진행률 조회 또는 생성
        UserProgress progress = userProgressRepository.findByUserIdAndReadingDate(userId, today)
                .orElse(createDefaultProgress(userId, today));
        
        // 읽기 완료 상태 토글
        // 현재는 단순히 completed 값에 따라 1씩 증가/감소
        // TODO: 실제로는 readingId에 해당하는 특정 읽기 항목의 상태를 관리해야 함
        int currentCompleted = progress.getCompletedReadings();
        
        if (completed) {
            // 완료로 변경: 최대값을 넘지 않도록 제한
            if (currentCompleted < progress.getTotalReadings()) {
                progress.setCompletedReadings(currentCompleted + 1);
            }
        } else {
            // 미완료로 변경: 0보다 작아지지 않도록 제한
            if (currentCompleted > 0) {
                progress.setCompletedReadings(currentCompleted - 1);
            }
        }
        
        // 진행률 퍼센트 계산
        progress.setProgressPercentage(
            (double) progress.getCompletedReadings() / progress.getTotalReadings() * 100
        );
        
        progress.setUpdatedAt(LocalDateTime.now());
        
        return userProgressRepository.save(progress);
    }
    
    /**
     * 기본 진행률 생성
     */
    private UserProgress createDefaultProgress(Long userId, LocalDate readingDate) {
        return new UserProgress(
                null, // ID는 저장 시 생성
                userId,
                readingDate,
                1, // 기본 Day 1
                null, // readings는 별도 처리
                0, // 완료된 읽기 수
                4, // 총 읽기 수 (맥체인 플랜)
                0.0, // 진행률 0%
                LocalDateTime.now(), // createdAt
                LocalDateTime.now()  // updatedAt
        );
    }
}
