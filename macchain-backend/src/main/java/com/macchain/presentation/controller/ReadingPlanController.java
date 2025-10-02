package com.macchain.presentation.controller;

import com.macchain.application.usecase.GetTodayPlanUseCase;
import com.macchain.domain.entity.ReadingPlan;
import com.macchain.presentation.dto.McCheynePlanResponse;
import com.macchain.presentation.mapper.ReadingPlanResponseMapper;
import com.macchain.infrastructure.repository.McCheynePlanJpaRepository;
import com.macchain.infrastructure.entity.McCheynePlanJpaEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.time.LocalDateTime;

/**
 * 읽기 계획 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/mccheyne")
@CrossOrigin(origins = {"http://localhost:3000"})
public class ReadingPlanController {
    
    private final GetTodayPlanUseCase getTodayPlanUseCase;
    private final ReadingPlanResponseMapper responseMapper;
    private final McCheynePlanJpaRepository mccheynePlanRepository;
    
    public ReadingPlanController(GetTodayPlanUseCase getTodayPlanUseCase,
                                ReadingPlanResponseMapper responseMapper,
                                McCheynePlanJpaRepository mccheynePlanRepository) {
        this.getTodayPlanUseCase = getTodayPlanUseCase;
        this.responseMapper = responseMapper;
        this.mccheynePlanRepository = mccheynePlanRepository;
    }
    
    /**
     * 오늘의 읽기 계획 조회
     */
    @GetMapping("/today")
    public ResponseEntity<McCheynePlanResponse> getTodayPlan() {
        Optional<ReadingPlan> plan = getTodayPlanUseCase.execute();
        
        if (plan.isPresent()) {
            McCheynePlanResponse response = responseMapper.toResponse(plan.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 특정 일자의 읽기 계획 조회
     */
    @GetMapping("/day/{dayNumber}")
    public ResponseEntity<McCheynePlanResponse> getPlanByDay(@PathVariable Integer dayNumber) {
        Optional<ReadingPlan> plan = getTodayPlanUseCase.execute(dayNumber);
        
        if (plan.isPresent()) {
            McCheynePlanResponse response = responseMapper.toResponse(plan.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 테스트용 간단한 API
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        try {
            Optional<ReadingPlan> plan = getTodayPlanUseCase.execute(1);
            if (plan.isPresent()) {
                return ResponseEntity.ok("데이터 조회 성공: " + plan.get().getDayNumber());
            } else {
                return ResponseEntity.ok("데이터 없음");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("에러: " + e.getMessage());
        }
    }
    
    /**
     * McCheyne Plan 데이터 초기화
     */
    @PostMapping("/init-data")
    @Transactional
    public ResponseEntity<String> initData() {
        try {
            // 기존 데이터 삭제
            mccheynePlanRepository.deleteAll();
            
            // 테스트 데이터 삽입 (처음 10일)
            for (int day = 1; day <= 10; day++) {
                McCheynePlanJpaEntity plan = new McCheynePlanJpaEntity();
                plan.setDayNumber(day);
                plan.setReading1Book("genesis");
                plan.setReading1Chapter(day);
                plan.setReading2Book("ezra");
                plan.setReading2Chapter(day);
                plan.setReading3Book("matthew");
                plan.setReading3Chapter(day);
                plan.setReading4Book("acts");
                plan.setReading4Chapter(day);
                plan.setCreatedAt(LocalDateTime.now());
                
                mccheynePlanRepository.save(plan);
            }
            
            return ResponseEntity.ok("McCheyne Plan 데이터 초기화 완료: 10일 데이터 삽입");
        } catch (Exception e) {
            return ResponseEntity.ok("데이터 초기화 실패: " + e.getMessage());
        }
    }
}
