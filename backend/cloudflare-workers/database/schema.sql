-- MacChain D1 Database Schema
-- Spring Boot의 PostgreSQL/MongoDB를 D1 SQLite로 마이그레이션

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 진행률 테이블
CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_days_read INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    books_completed INTEGER DEFAULT 0,
    last_read_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- McCheyne 읽기 계획 테이블
CREATE TABLE IF NOT EXISTS mccheyne_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL,
    reading1_book TEXT,
    reading1_chapter INTEGER,
    reading1_verse_start INTEGER,
    reading1_verse_end INTEGER,
    reading2_book TEXT,
    reading2_chapter INTEGER,
    reading2_verse_start INTEGER,
    reading2_verse_end INTEGER,
    reading3_book TEXT,
    reading3_chapter INTEGER,
    reading3_verse_start INTEGER,
    reading3_verse_end INTEGER,
    reading4_book TEXT,
    reading4_chapter INTEGER,
    reading4_verse_start INTEGER,
    reading4_verse_end INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 읽기 진행률 테이블
CREATE TABLE IF NOT EXISTS reading_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_date DATE NOT NULL,
    reading_id INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_date) REFERENCES mccheyne_plan(date) ON DELETE CASCADE,
    UNIQUE(user_id, plan_date, reading_id)
);

-- 사용자 설정 테이블
CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notification_enabled BOOLEAN DEFAULT 1,
    reminder_time TIME DEFAULT '09:00',
    language TEXT DEFAULT 'ko',
    theme TEXT DEFAULT 'light',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

-- AI 분석 결과 테이블 (MongoDB 대체)
CREATE TABLE IF NOT EXISTS ai_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_date DATE NOT NULL,
    reading_id INTEGER NOT NULL,
    analysis_type TEXT NOT NULL, -- 'word', 'verse', 'chapter'
    analysis_data TEXT NOT NULL, -- JSON 형태로 저장
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_date) REFERENCES mccheyne_plan(date) ON DELETE CASCADE
);

-- 월별 성경 데이터 테이블
CREATE TABLE IF NOT EXISTS monthly_bible_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month, book, chapter, verse)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mccheyne_plan_date ON mccheyne_plan(date);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_date ON reading_progress(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_reading_progress_completed ON reading_progress(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_user_date ON ai_analysis(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_monthly_bible_data_book_chapter ON monthly_bible_data(book, chapter);

-- 트리거: 사용자 생성 시 기본 설정 생성
CREATE TRIGGER IF NOT EXISTS create_user_settings
    AFTER INSERT ON users
    BEGIN
        INSERT INTO user_settings (user_id) VALUES (NEW.id);
    END;

-- 트리거: 사용자 진행률 업데이트 시 통계 갱신
CREATE TRIGGER IF NOT EXISTS update_user_stats
    AFTER UPDATE ON reading_progress
    WHEN NEW.is_completed = 1 AND OLD.is_completed = 0
    BEGIN
        UPDATE user_progress 
        SET 
            total_days_read = total_days_read + 1,
            last_read_date = NEW.plan_date,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.user_id;
    END;

-- 사용자 동의 설정 테이블
CREATE TABLE IF NOT EXISTS user_consents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    privacy_consent BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    notification_consent BOOLEAN DEFAULT FALSE,
    age_consent BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 사용자 동의 설정 인덱스
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
