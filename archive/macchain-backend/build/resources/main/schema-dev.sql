-- 개발용 스키마 생성
CREATE TABLE IF NOT EXISTS mccheyne_plan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    day_number INTEGER NOT NULL UNIQUE,
    reading1_book VARCHAR(255) NOT NULL,
    reading1_chapter INTEGER NOT NULL,
    reading2_book VARCHAR(255) NOT NULL,
    reading2_chapter INTEGER NOT NULL,
    reading3_book VARCHAR(255) NOT NULL,
    reading3_chapter INTEGER NOT NULL,
    reading4_book VARCHAR(255) NOT NULL,
    reading4_chapter INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    day_number INTEGER NOT NULL,
    reading1_completed BOOLEAN DEFAULT FALSE,
    reading2_completed BOOLEAN DEFAULT FALSE,
    reading3_completed BOOLEAN DEFAULT FALSE,
    reading4_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_days_read INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_read_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    theme VARCHAR(50) DEFAULT 'light',
    font_size INTEGER DEFAULT 16,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
