package com.macchain.infrastructure.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 사용자 설정 JPA 엔티티
 */
@Entity
@Table(name = "user_settings")
public class UserSettingsJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "theme", length = 20, nullable = false)
    private String theme;
    
    @Column(name = "email_notifications", nullable = false)
    private boolean emailNotifications;
    
    @Column(name = "push_notifications", nullable = false)
    private boolean pushNotifications;
    
    @Column(name = "reading_reminder_time", length = 10)
    private String readingReminderTime;
    
    @Column(name = "language", length = 10, nullable = false)
    private String language;
    
    @Column(name = "show_original_text", nullable = false)
    private boolean showOriginalText;
    
    @Column(name = "auto_play_audio", nullable = false)
    private boolean autoPlayAudio;
    
    @Column(name = "font_size", length = 20, nullable = false)
    private String fontSize;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 기본 생성자
    public UserSettingsJpaEntity() {}

    // 전체 생성자
    public UserSettingsJpaEntity(Long id, Long userId, String theme, boolean emailNotifications,
                                boolean pushNotifications, String readingReminderTime, String language,
                                boolean showOriginalText, boolean autoPlayAudio, String fontSize,
                                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.theme = theme;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.readingReminderTime = readingReminderTime;
        this.language = language;
        this.showOriginalText = showOriginalText;
        this.autoPlayAudio = autoPlayAudio;
        this.fontSize = fontSize;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public boolean isPushNotifications() {
        return pushNotifications;
    }

    public void setPushNotifications(boolean pushNotifications) {
        this.pushNotifications = pushNotifications;
    }

    public String getReadingReminderTime() {
        return readingReminderTime;
    }

    public void setReadingReminderTime(String readingReminderTime) {
        this.readingReminderTime = readingReminderTime;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public boolean isShowOriginalText() {
        return showOriginalText;
    }

    public void setShowOriginalText(boolean showOriginalText) {
        this.showOriginalText = showOriginalText;
    }

    public boolean isAutoPlayAudio() {
        return autoPlayAudio;
    }

    public void setAutoPlayAudio(boolean autoPlayAudio) {
        this.autoPlayAudio = autoPlayAudio;
    }

    public String getFontSize() {
        return fontSize;
    }

    public void setFontSize(String fontSize) {
        this.fontSize = fontSize;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

