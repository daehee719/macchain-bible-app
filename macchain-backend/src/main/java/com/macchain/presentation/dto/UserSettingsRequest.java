package com.macchain.presentation.dto;

/**
 * 사용자 설정 요청 DTO
 */
public class UserSettingsRequest {
    private String theme;
    private boolean emailNotifications;
    private boolean pushNotifications;
    private String readingReminderTime;
    private String language;
    private boolean showOriginalText;
    private boolean autoPlayAudio;
    private String fontSize;

    // 기본 생성자
    public UserSettingsRequest() {}

    // 전체 생성자
    public UserSettingsRequest(String theme, boolean emailNotifications, boolean pushNotifications,
                              String readingReminderTime, String language, boolean showOriginalText,
                              boolean autoPlayAudio, String fontSize) {
        this.theme = theme;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.readingReminderTime = readingReminderTime;
        this.language = language;
        this.showOriginalText = showOriginalText;
        this.autoPlayAudio = autoPlayAudio;
        this.fontSize = fontSize;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "UserSettingsRequest{" +
                "theme='" + theme + '\'' +
                ", emailNotifications=" + emailNotifications +
                ", pushNotifications=" + pushNotifications +
                ", readingReminderTime='" + readingReminderTime + '\'' +
                ", language='" + language + '\'' +
                ", showOriginalText=" + showOriginalText +
                ", autoPlayAudio=" + autoPlayAudio +
                ", fontSize='" + fontSize + '\'' +
                '}';
    }
}

