package com.macchain.application.usecase;

import com.macchain.domain.entity.User;
import com.macchain.domain.port.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 사용자 회원가입 유스케이스
 */
@Service
public class RegisterUserUseCase {
    
    private final UserRepository userRepository;
    
    public RegisterUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * 사용자 회원가입
     */
    public User execute(String email, String password, String name, String nickname) {
        // 비즈니스 규칙 검증
        validateRegistration(email, password, name, nickname);
        
        // 중복 검사
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        
        if (userRepository.existsByNickname(nickname)) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }
        
        // 사용자 생성 및 저장
        User user = new User(email, password, name, nickname);
        return userRepository.save(user);
    }
    
    private void validateRegistration(String email, String password, String name, String nickname) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }
        
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }
        
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }
        
        if (nickname == null || nickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임은 필수입니다.");
        }
        
        if (password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }
    }
}

