package com.macchain.presentation.dto;

import java.time.LocalDateTime;

/**
 * 사용자 설정 응답 DTO
 */
public class UserSettingsResponse {
    private Long id;
    private Long userId;
    private String theme;
    private boolean emailNotifications;
    private boolean pushNotifications;
    private String readingReminderTime;
    private String language;
    private boolean showOriginalText;
    private boolean autoPlayAudio;
    private String fontSize;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 기본 생성자
    public UserSettingsResponse() {}

    // 전체 생성자
    public UserSettingsResponse(Long id, Long userId, String theme, boolean emailNotifications,
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

    @Override
    public String toString() {
        return "UserSettingsResponse{" +
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

