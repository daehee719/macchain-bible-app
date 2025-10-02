package com.macchain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableScheduling
@CrossOrigin(origins = "http://localhost:5173") // Vite 개발 서버 CORS 허용
public class MacChainApplication {
    public static void main(String[] args) {
        SpringApplication.run(MacChainApplication.class, args);
    }
}
