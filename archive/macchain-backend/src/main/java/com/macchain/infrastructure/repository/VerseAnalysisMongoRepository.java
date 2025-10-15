package com.macchain.infrastructure.repository;

import com.macchain.domain.entity.VerseAnalysisDocument;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 구절 원어분석 MongoDB 리포지토리
 */
@Repository
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public interface VerseAnalysisMongoRepository extends MongoRepository<VerseAnalysisDocument, String> {
    
    /**
     * 특정 구절의 분석 결과 조회
     */
    @Query("{ 'book': ?0, 'chapter': ?1, 'verse': ?2 }")
    Optional<VerseAnalysisDocument> findByBookAndChapterAndVerse(String book, int chapter, int verse);
    
    /**
     * 특정 구절의 분석 결과 존재 여부 확인
     */
    @Query(value = "{ 'book': ?0, 'chapter': ?1, 'verse': ?2 }", exists = true)
    boolean existsByBookAndChapterAndVerse(String book, int chapter, int verse);
    
    /**
     * 특정 장의 모든 구절 분석 결과 조회
     */
    @Query("{ 'book': ?0, 'chapter': ?1 }")
    List<VerseAnalysisDocument> findByBookAndChapterOrderByVerse(String book, int chapter);
    
    /**
     * 특정 날짜에 분석된 구절들 조회
     */
    @Query("{ 'analysisDate': ?0 }")
    List<VerseAnalysisDocument> findByAnalysisDateOrderByBookAscChapterAscVerseAsc(LocalDate analysisDate);
    
    /**
     * 특정 책의 모든 분석 결과 조회
     */
    @Query("{ 'book': ?0 }")
    List<VerseAnalysisDocument> findByBookOrderByChapterAscVerseAsc(String book);
    
    /**
     * 최근 분석된 구절들 조회 (최대 10개)
     */
    @Query(value = "{}", sort = "{ 'analysisDate': -1, 'book': 1, 'chapter': 1, 'verse': 1 }")
    List<VerseAnalysisDocument> findTop10ByOrderByAnalysisDateDesc();
    
    /**
     * 특정 날짜 범위의 분석 결과 조회
     */
    @Query("{ 'analysisDate': { $gte: ?0, $lte: ?1 } }")
    List<VerseAnalysisDocument> findByAnalysisDateBetweenOrderByAnalysisDateDescBookAscChapterAscVerseAsc(
        LocalDate startDate, LocalDate endDate);
}

