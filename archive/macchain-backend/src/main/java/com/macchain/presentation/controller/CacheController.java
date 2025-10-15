package com.macchain.presentation.controller;

import com.macchain.infrastructure.service.RedisCacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 캐시 관리 REST 컨트롤러
 */
@RestController
@RequestMapping("/api/cache")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006"})
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public class CacheController {
    
    @Autowired
    private RedisCacheService redisCacheService;
    
    /**
     * 캐시 통계 조회
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("message", "Redis Cache Statistics");
        stats.put("stats", redisCacheService.getCacheStats());
        stats.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(stats);
    }
    
    /**
     * 특정 캐시 제거
     */
    @DeleteMapping("/{cacheName}/{key}")
    public ResponseEntity<Map<String, Object>> evictCache(
            @PathVariable String cacheName,
            @PathVariable String key) {
        
        redisCacheService.evict(cacheName, key);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cache evicted successfully");
        response.put("cacheName", cacheName);
        response.put("key", key);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 캐시 전체 제거
     */
    @DeleteMapping("/{cacheName}")
    public ResponseEntity<Map<String, Object>> evictAllCache(@PathVariable String cacheName) {
        redisCacheService.evictAll(cacheName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "All cache evicted successfully");
        response.put("cacheName", cacheName);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 캐시 키 존재 여부 확인
     */
    @GetMapping("/{cacheName}/{key}/exists")
    public ResponseEntity<Map<String, Object>> checkCacheExists(
            @PathVariable String cacheName,
            @PathVariable String key) {
        
        boolean exists = redisCacheService.exists(cacheName, key);
        
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("cacheName", cacheName);
        response.put("key", key);
        
        return ResponseEntity.ok(response);
    }
}
