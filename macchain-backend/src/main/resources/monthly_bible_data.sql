-- 월별 성경 데이터 테이블 생성
CREATE TABLE IF NOT EXISTS monthly_bible_data (
    id BIGSERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    book VARCHAR(50) NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    english_text TEXT NOT NULL,
    hebrew_text TEXT,
    greek_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month, book, chapter, verse)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_monthly_bible_data_lookup 
ON monthly_bible_data(year, month, book, chapter, verse);

CREATE INDEX IF NOT EXISTS idx_monthly_bible_data_book_chapter 
ON monthly_bible_data(book, chapter);

