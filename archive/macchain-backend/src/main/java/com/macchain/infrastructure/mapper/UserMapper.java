package com.macchain.infrastructure.mapper;

import com.macchain.domain.entity.User;
import com.macchain.infrastructure.entity.UserJpaEntity;
import org.springframework.stereotype.Component;

/**
 * 사용자 도메인 엔티티와 JPA 엔티티 간 매핑
 */
@Component
public class UserMapper {
    
    /**
     * JPA 엔티티를 도메인 엔티티로 변환
     */
    public User toDomain(UserJpaEntity jpaEntity) {
        User user = new User(
            jpaEntity.getEmail(),
            jpaEntity.getPassword(),
            jpaEntity.getName(),
            jpaEntity.getNickname()
        );
        
        user.setId(jpaEntity.getId());
        user.setCreatedAt(jpaEntity.getCreatedAt());
        user.setLastLoginAt(jpaEntity.getLastLoginAt());
        user.setActive(jpaEntity.isActive());
        
        return user;
    }
    
    /**
     * 도메인 엔티티를 JPA 엔티티로 변환
     */
    public UserJpaEntity toJpa(User domain) {
        UserJpaEntity jpaEntity = new UserJpaEntity();
        
        jpaEntity.setId(domain.getId());
        jpaEntity.setEmail(domain.getEmail());
        jpaEntity.setPassword(domain.getPassword());
        jpaEntity.setName(domain.getName());
        jpaEntity.setNickname(domain.getNickname());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setLastLoginAt(domain.getLastLoginAt());
        jpaEntity.setActive(domain.isActive());
        
        return jpaEntity;
    }
}

