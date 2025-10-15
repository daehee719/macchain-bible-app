-- McCheyne 읽기 계획 샘플 데이터 (D1용)
-- 원래 프로젝트의 data.sql을 D1 SQLite 형식으로 변환

-- 기존 데이터 삭제 (있다면)
DELETE FROM mccheyne_plan;

-- McCheyne 365일 플랜 데이터 (처음 10일만)
INSERT INTO mccheyne_plan (date, reading1_book, reading1_chapter, reading1_verse_start, reading1_verse_end, reading2_book, reading2_chapter, reading2_verse_start, reading2_verse_end, reading3_book, reading3_chapter, reading3_verse_start, reading3_verse_end, reading4_book, reading4_chapter, reading4_verse_start, reading4_verse_end, created_at) VALUES
('2025-01-01', 'genesis', 1, 1, 31, 'ezra', 1, 1, 11, 'matthew', 1, 1, 25, 'acts', 1, 1, 26, datetime('now')),
('2025-01-02', 'genesis', 2, 1, 25, 'ezra', 2, 1, 70, 'matthew', 2, 1, 23, 'acts', 2, 1, 47, datetime('now')),
('2025-01-03', 'genesis', 3, 1, 24, 'ezra', 3, 1, 13, 'matthew', 3, 1, 17, 'acts', 3, 1, 26, datetime('now')),
('2025-01-04', 'genesis', 4, 1, 26, 'ezra', 4, 1, 24, 'matthew', 4, 1, 25, 'acts', 4, 1, 37, datetime('now')),
('2025-01-05', 'genesis', 5, 1, 32, 'ezra', 5, 1, 17, 'matthew', 5, 1, 48, 'acts', 5, 1, 42, datetime('now')),
('2025-01-06', 'genesis', 6, 1, 22, 'ezra', 6, 1, 22, 'matthew', 6, 1, 34, 'acts', 6, 1, 15, datetime('now')),
('2025-01-07', 'genesis', 7, 1, 24, 'ezra', 7, 1, 28, 'matthew', 7, 1, 29, 'acts', 7, 1, 60, datetime('now')),
('2025-01-08', 'genesis', 8, 1, 22, 'ezra', 8, 1, 36, 'matthew', 8, 1, 34, 'acts', 8, 1, 40, datetime('now')),
('2025-01-09', 'genesis', 9, 1, 29, 'ezra', 9, 1, 15, 'matthew', 9, 1, 38, 'acts', 9, 1, 43, datetime('now')),
('2025-01-10', 'genesis', 10, 1, 32, 'ezra', 10, 1, 44, 'matthew', 10, 1, 42, 'acts', 10, 1, 48, datetime('now'));