package com.macchain.presentation.dto;

/**
 * 사용자 요청 DTO
 */
public class UserRequest {
    private String email;
    private String password;
    private String name;
    private String nickname;
    
    // 기본 생성자
    public UserRequest() {}
    
    // 모든 필드 생성자
    public UserRequest(String email, String password, String name, String nickname) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
    }
    
    // Getter/Setter 메서드들
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}
