package com.macchain.infrastructure.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis 캐싱 설정
 */
@Configuration
@EnableCaching
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        // 기본 캐시 설정
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1)) // 1시간 TTL
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();
        
        // 캐시별 설정
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // 맥체인 플랜 캐시 (더 긴 TTL)
        cacheConfigurations.put("mccheyne-plans", 
                defaultConfig.entryTtl(Duration.ofHours(24))); // 24시간
        
        // 사용자 진행률 캐시 (짧은 TTL)
        cacheConfigurations.put("user-progress", 
                defaultConfig.entryTtl(Duration.ofMinutes(30))); // 30분
        
        // 사용자 통계 캐시 (중간 TTL)
        cacheConfigurations.put("user-statistics", 
                defaultConfig.entryTtl(Duration.ofHours(2))); // 2시간
        
        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}
