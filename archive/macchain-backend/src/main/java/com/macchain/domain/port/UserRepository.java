package com.macchain.domain.port;

import com.macchain.domain.entity.User;
import java.util.Optional;

/**
 * 사용자 저장소 포트 (인터페이스)
 * 도메인 레이어에서 정의하는 저장소 계약
 */
public interface UserRepository {
    
    /**
     * 이메일로 사용자 조회
     */
    Optional<User> findByEmail(String email);
    
    /**
     * ID로 사용자 조회
     */
    Optional<User> findById(Long id);
    
    /**
     * 닉네임으로 사용자 조회
     */
    Optional<User> findByNickname(String nickname);
    
    /**
     * 사용자 저장
     */
    User save(User user);
    
    /**
     * 사용자 삭제
     */
    void deleteById(Long id);
    
    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(String email);
    
    /**
     * 닉네임 존재 여부 확인
     */
    boolean existsByNickname(String nickname);
}

