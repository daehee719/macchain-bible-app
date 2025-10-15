package com.macchain.infrastructure.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.concurrent.Callable;

/**
 * Redis 캐시 서비스
 */
@Service
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public class RedisCacheService {
    
    @Autowired
    private CacheManager cacheManager;
    
    /**
     * 캐시에서 값 조회
     */
    public <T> T get(String cacheName, String key, Class<T> type) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            Cache.ValueWrapper wrapper = cache.get(key);
            if (wrapper != null) {
                return type.cast(wrapper.get());
            }
        }
        return null;
    }
    
    /**
     * 캐시에서 값 조회 (Callable 사용)
     */
    public <T> T get(String cacheName, String key, Callable<T> valueLoader) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            return cache.get(key, valueLoader);
        }
        return null;
    }
    
    /**
     * 캐시에 값 저장
     */
    public void put(String cacheName, String key, Object value) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.put(key, value);
        }
    }
    
    /**
     * 캐시에서 값 제거
     */
    public void evict(String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }
    
    /**
     * 캐시 전체 제거
     */
    public void evictAll(String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
    }
    
    /**
     * 캐시 키 존재 여부 확인
     */
    public boolean exists(String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            return cache.get(key) != null;
        }
        return false;
    }
    
    /**
     * 캐시 통계 정보
     */
    public String getCacheStats() {
        StringBuilder stats = new StringBuilder();
        stats.append("Redis Cache Statistics:\n");
        
        for (String cacheName : cacheManager.getCacheNames()) {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                stats.append(String.format("- %s: %s\n", cacheName, cache.getClass().getSimpleName()));
            }
        }
        
        return stats.toString();
    }
}

