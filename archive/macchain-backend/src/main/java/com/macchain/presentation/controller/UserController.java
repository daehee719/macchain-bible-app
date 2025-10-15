package com.macchain.presentation.controller;

import com.macchain.application.usecase.LoginUserUseCase;
import com.macchain.application.usecase.RegisterUserUseCase;
import com.macchain.domain.entity.User;
import com.macchain.presentation.dto.UserRequest;
import com.macchain.presentation.dto.UserResponse;
import com.macchain.presentation.mapper.UserResponseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * 사용자 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000"})
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public class UserController {
    
    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final UserResponseMapper userResponseMapper;
    
    /**
     * 사용자 회원가입
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRequest request) {
        try {
            User user = registerUserUseCase.execute(
                request.getEmail(),
                request.getPassword(),
                request.getName(),
                request.getNickname()
            );
            
            UserResponse response = userResponseMapper.toResponse(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 사용자 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {
        Optional<User> userOpt = loginUserUseCase.execute(
            request.getEmail(),
            request.getPassword()
        );
        
        if (userOpt.isPresent()) {
            UserResponse response = userResponseMapper.toResponse(userOpt.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
