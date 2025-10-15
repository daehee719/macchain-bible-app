package com.macchain.application.usecase;

import com.macchain.domain.entity.User;
import com.macchain.domain.port.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 사용자 로그인 유스케이스
 */
@Service
public class LoginUserUseCase {
    
    private final UserRepository userRepository;
    
    public LoginUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * 사용자 로그인
     */
    public Optional<User> execute(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // 비밀번호 검증 (실제로는 해시된 비밀번호 비교)
            if (user.getPassword().equals(password) && user.isActive()) {
                user.login(); // 로그인 시간 업데이트
                userRepository.save(user);
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }
}

