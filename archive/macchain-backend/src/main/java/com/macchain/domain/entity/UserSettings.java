package com.macchain.domain.entity;

import java.time.LocalDateTime;

/**
 * 사용자 설정 도메인 엔티티
 */
public class UserSettings {
    private Long id;
    private Long userId;
    private String theme; // 'light', 'dark', 'auto'
    private boolean emailNotifications;
    private boolean pushNotifications;
    private String readingReminderTime; // "09:00", "21:00" 등
    private String language; // 'ko', 'en'
    private boolean showOriginalText; // 원어 표시 여부
    private boolean autoPlayAudio; // 자동 음성 재생 여부
    private String fontSize; // 'small', 'medium', 'large'
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 기본 생성자
    public UserSettings() {}

    // 전체 생성자
    public UserSettings(Long id, Long userId, String theme, boolean emailNotifications, 
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

    // 기본 설정 생성자
    public UserSettings(Long userId) {
        this.userId = userId;
        this.theme = "dark";
        this.emailNotifications = true;
        this.pushNotifications = true;
        this.readingReminderTime = "09:00";
        this.language = "ko";
        this.showOriginalText = true;
        this.autoPlayAudio = false;
        this.fontSize = "medium";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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

    @Override
    public String toString() {
        return "UserSettings{" +
                "id=" + id +
                ", userId=" + userId +
                ", theme='" + theme + '\'' +
                ", emailNotifications=" + emailNotifications +
                ", pushNotifications=" + pushNotifications +
                ", readingReminderTime='" + readingReminderTime + '\'' +
                ", language='" + language + '\'' +
                ", showOriginalText=" + showOriginalText +
                ", autoPlayAudio=" + autoPlayAudio +
                ", fontSize='" + fontSize + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}

