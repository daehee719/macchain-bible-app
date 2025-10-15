package com.macchain.presentation.mapper;

import com.macchain.domain.entity.User;
import com.macchain.presentation.dto.UserResponse;
import org.springframework.stereotype.Component;

/**
 * 사용자 도메인 엔티티와 응답 DTO 간 매핑
 */
@Component
public class UserResponseMapper {
    
    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getNickname(),
            user.getCreatedAt(),
            user.getLastLoginAt(),
            user.isActive()
        );
    }
}

