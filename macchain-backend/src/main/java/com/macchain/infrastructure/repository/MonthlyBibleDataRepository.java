package com.macchain.infrastructure.repository;

import com.macchain.domain.entity.MonthlyBibleData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 월별 성경 데이터 리포지토리
 */
@Repository
public interface MonthlyBibleDataRepository extends JpaRepository<MonthlyBibleData, Long> {
    
    /**
     * 특정 년월의 특정 책과 장의 모든 구절 조회
     */
    @Query("SELECT m FROM MonthlyBibleData m WHERE m.year = :year AND m.month = :month AND m.book = :book AND m.chapter = :chapter ORDER BY m.verse")
    List<MonthlyBibleData> findByYearAndMonthAndBookAndChapter(
        @Param("year") Integer year, 
        @Param("month") Integer month, 
        @Param("book") String book, 
        @Param("chapter") Integer chapter
    );
    
    /**
     * 특정 년월의 특정 구절 조회
     */
    @Query("SELECT m FROM MonthlyBibleData m WHERE m.year = :year AND m.month = :month AND m.book = :book AND m.chapter = :chapter AND m.verse = :verse")
    Optional<MonthlyBibleData> findByYearAndMonthAndBookAndChapterAndVerse(
        @Param("year") Integer year, 
        @Param("month") Integer month, 
        @Param("book") String book, 
        @Param("chapter") Integer chapter,
        @Param("verse") Integer verse
    );
    
    /**
     * 특정 년월의 모든 데이터 조회
     */
    @Query("SELECT m FROM MonthlyBibleData m WHERE m.year = :year AND m.month = :month ORDER BY m.book, m.chapter, m.verse")
    List<MonthlyBibleData> findByYearAndMonth(@Param("year") Integer year, @Param("month") Integer month);
    
    /**
     * 특정 년월의 데이터 존재 여부 확인
     */
    boolean existsByYearAndMonth(Integer year, Integer month);
}

