package com.macchain.domain.entity;

import java.time.LocalDateTime;

/**
 * 사용자 도메인 엔티티
 * 사용자 정보와 비즈니스 로직을 포함
 */
public class User {
    private Long id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private boolean isActive;
    
    // 기본 생성자
    public User() {}
    
    // 모든 필드 생성자
    public User(Long id, String email, String password, String name, String nickname, 
                LocalDateTime createdAt, LocalDateTime lastLoginAt, boolean isActive) {
        this.id = id;
        this.email = email;
        this.password = password;
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
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
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
    
    public User(String email, String password, String name, String nickname) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    // 비즈니스 규칙: 이메일 형식 검증
    public boolean isValidEmail() {
        return email != null && email.contains("@") && email.contains(".");
    }
    
    // 비즈니스 규칙: 비밀번호 최소 길이 검증
    public boolean isValidPassword() {
        return password != null && password.length() >= 8;
    }
    
    // 비즈니스 로직: 로그인 처리
    public void login() {
        this.lastLoginAt = LocalDateTime.now();
    }
    
    // 비즈니스 로직: 계정 비활성화
    public void deactivate() {
        this.isActive = false;
    }
    
    // 비즈니스 로직: 계정 활성화
    public void activate() {
        this.isActive = true;
    }
}
