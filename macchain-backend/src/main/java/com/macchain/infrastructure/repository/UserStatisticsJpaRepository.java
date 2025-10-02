package com.macchain.infrastructure.repository;

import com.macchain.infrastructure.entity.UserStatisticsJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserStatisticsJpaRepository extends JpaRepository<UserStatisticsJpaEntity, Long> {
    
    /**
     * 사용자의 특정 날짜 통계 조회
     */
    Optional<UserStatisticsJpaEntity> findByUserIdAndStatisticsDate(Long userId, LocalDate statisticsDate);
    
    /**
     * 사용자의 모든 통계 조회 (최신순)
     */
    List<UserStatisticsJpaEntity> findByUserIdOrderByStatisticsDateDesc(Long userId);
    
    /**
     * 사용자의 월별 통계 조회
     */
    @Query("SELECT s FROM UserStatisticsJpaEntity s WHERE s.userId = :userId " +
           "AND YEAR(s.statisticsDate) = :year AND MONTH(s.statisticsDate) = :month " +
           "ORDER BY s.statisticsDate DESC")
    List<UserStatisticsJpaEntity> findByUserIdAndMonth(@Param("userId") Long userId, 
                                                       @Param("year") int year, 
                                                       @Param("month") int month);
    
    /**
     * 사용자의 연도별 통계 조회
     */
    @Query("SELECT s FROM UserStatisticsJpaEntity s WHERE s.userId = :userId " +
           "AND YEAR(s.statisticsDate) = :year ORDER BY s.statisticsDate DESC")
    List<UserStatisticsJpaEntity> findByUserIdAndYear(@Param("userId") Long userId, 
                                                      @Param("year") int year);
    
    /**
     * 사용자의 최신 통계 삭제
     */
    void deleteByUserIdAndStatisticsDate(Long userId, LocalDate statisticsDate);
}

