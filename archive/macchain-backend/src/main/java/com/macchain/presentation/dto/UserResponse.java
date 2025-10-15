package com.macchain.presentation.dto;

import java.time.LocalDateTime;

/**
 * 사용자 응답 DTO
 */
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private boolean isActive;
    
    // 기본 생성자
    public UserResponse() {}
    
    // 모든 필드 생성자
    public UserResponse(Long id, String email, String name, String nickname, 
                       LocalDateTime createdAt, LocalDateTime lastLoginAt, boolean isActive) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this.isActive = isActive;
    }
    
    // Getter/Setter 메서드들
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
