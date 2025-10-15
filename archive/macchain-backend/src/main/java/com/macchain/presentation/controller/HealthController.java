package com.macchain.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 헬스 체크 컨트롤러
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3003"})
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = Map.of(
                "status", "UP",
                "timestamp", LocalDateTime.now(),
                "service", "MacChain Backend",
                "version", "1.0.0"
        );
        
        return ResponseEntity.ok(response);
    }
}
