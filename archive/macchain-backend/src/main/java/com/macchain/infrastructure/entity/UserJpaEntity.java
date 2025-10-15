package com.macchain.infrastructure.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 사용자 JPA 엔티티
 */
@Entity
@Table(name = "users")
public class UserJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String nickname;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    // 기본 생성자
    public UserJpaEntity() {}
    
    // 모든 필드 생성자
    public UserJpaEntity(Long id, String email, String password, String name, String nickname, 
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
}
