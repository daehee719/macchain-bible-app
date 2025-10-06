package com.macchain.presentation.controller;

import com.macchain.application.usecase.LoginUserUseCase;
import com.macchain.application.usecase.RegisterUserUseCase;
import com.macchain.domain.entity.User;
import com.macchain.infrastructure.security.JwtUtil;
import com.macchain.presentation.dto.AuthRequest;
import com.macchain.presentation.dto.AuthResponse;
import com.macchain.presentation.dto.UserRequest;
import com.macchain.presentation.dto.UserResponse;
import com.macchain.presentation.mapper.UserResponseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * 인증 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000"})
@RequiredArgsConstructor
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final UserResponseMapper userResponseMapper;
    private final JwtUtil jwtUtil;

    /**
     * 사용자 회원가입
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRequest request) {
        try {
            User user = registerUserUseCase.execute(
                request.getEmail(), 
                request.getPassword(), 
                request.getName(), 
                request.getNickname()
            );
            UserResponse userResponse = userResponseMapper.toResponse(user);
            String token = jwtUtil.generateToken(user.getEmail(), user.getId());
            
            AuthResponse response = new AuthResponse(
                true,
                "회원가입이 완료되었습니다.",
                token,
                userResponse
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(
                false,
                "회원가입에 실패했습니다: " + e.getMessage(),
                null,
                null
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 사용자 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            Optional<User> userOpt = loginUserUseCase.execute(request.getEmail(), request.getPassword());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserResponse userResponse = userResponseMapper.toResponse(user);
                String token = jwtUtil.generateToken(user.getEmail(), user.getId());
                
                AuthResponse response = new AuthResponse(
                    true,
                    "로그인이 완료되었습니다.",
                    token,
                    userResponse
                );
                
                return ResponseEntity.ok(response);
            } else {
                AuthResponse response = new AuthResponse(
                    false,
                    "이메일 또는 비밀번호가 올바르지 않습니다.",
                    null,
                    null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(
                false,
                "로그인에 실패했습니다: " + e.getMessage(),
                null,
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 토큰 검증
     */
    @PostMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                    String email = jwtUtil.getEmailFromToken(token);
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    
                    AuthResponse response = new AuthResponse(
                        true,
                        "토큰이 유효합니다.",
                        token,
                        new UserResponse(userId, email, null, null, null, null, true)
                    );
                    
                    return ResponseEntity.ok(response);
                }
            }
            
            AuthResponse response = new AuthResponse(
                false,
                "유효하지 않은 토큰입니다.",
                null,
                null
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(
                false,
                "토큰 검증에 실패했습니다: " + e.getMessage(),
                null,
                null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
