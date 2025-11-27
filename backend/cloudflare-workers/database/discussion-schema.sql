-- 토론 기능 데이터베이스 스키마
-- MacChain Bible App Discussion Feature

-- 1. 토론 카테고리 테이블
CREATE TABLE IF NOT EXISTS discussion_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. 토론 게시글 테이블
CREATE TABLE IF NOT EXISTS discussions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    passage_reference TEXT,  -- 성경 구절 참조 (예: "요한복음 3:16")
    passage_text TEXT,        -- 성경 구절 본문
    category_id INTEGER,      -- 카테고리 (선택적)
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT 0,
    is_locked BOOLEAN DEFAULT 0,  -- 댓글 잠금
    is_deleted BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES discussion_categories(id) ON DELETE SET NULL
);

-- 3. 댓글 테이블
CREATE TABLE IF NOT EXISTS discussion_comments (
    id TEXT PRIMARY KEY,
    discussion_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id TEXT,  -- 대댓글인 경우 부모 댓글 ID
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES discussion_comments(id) ON DELETE CASCADE
);

-- 4. 좋아요 테이블
CREATE TABLE IF NOT EXISTS discussion_likes (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    discussion_id TEXT,  -- 게시글 좋아요
    comment_id TEXT,     -- 댓글 좋아요
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES discussion_comments(id) ON DELETE CASCADE,
    -- discussion_id와 comment_id 중 하나만 있어야 함
    CHECK ((discussion_id IS NOT NULL AND comment_id IS NULL) OR 
           (discussion_id IS NULL AND comment_id IS NOT NULL))
);

-- 5. 북마크 테이블
CREATE TABLE IF NOT EXISTS discussion_bookmarks (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    discussion_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    UNIQUE(user_id, discussion_id)
);

-- 6. 신고 테이블
CREATE TABLE IF NOT EXISTS discussion_reports (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,  -- 신고한 사용자
    discussion_id TEXT,        -- 신고된 게시글
    comment_id TEXT,           -- 신고된 댓글
    reason TEXT NOT NULL,       -- 신고 사유
    description TEXT,           -- 상세 설명
    status TEXT DEFAULT 'pending',  -- pending, reviewed, resolved, rejected
    reviewed_by INTEGER,        -- 검토한 관리자 ID
    reviewed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES discussion_comments(id) ON DELETE CASCADE,
    CHECK ((discussion_id IS NOT NULL AND comment_id IS NULL) OR 
           (discussion_id IS NULL AND comment_id IS NOT NULL))
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_category_id ON discussions(category_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_is_pinned ON discussions(is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_is_deleted ON discussions(is_deleted);

CREATE INDEX IF NOT EXISTS idx_comments_discussion_id ON discussion_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON discussion_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON discussion_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON discussion_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_is_deleted ON discussion_comments(is_deleted);

CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_discussion ON discussion_likes(user_id, discussion_id) 
    WHERE discussion_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_comment ON discussion_likes(user_id, comment_id) 
    WHERE comment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_likes_discussion_id ON discussion_likes(discussion_id);
CREATE INDEX IF NOT EXISTS idx_likes_comment_id ON discussion_likes(comment_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON discussion_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_discussion_id ON discussion_bookmarks(discussion_id);

CREATE INDEX IF NOT EXISTS idx_reports_status ON discussion_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON discussion_reports(created_at);

-- 트리거: 댓글 수 자동 업데이트
CREATE TRIGGER IF NOT EXISTS update_discussion_comment_count
AFTER INSERT ON discussion_comments
WHEN NEW.is_deleted = 0
BEGIN
    UPDATE discussions 
    SET comment_count = comment_count + 1,
        updated_at = datetime('now')
    WHERE id = NEW.discussion_id;
END;

CREATE TRIGGER IF NOT EXISTS update_discussion_comment_count_delete
AFTER UPDATE ON discussion_comments
WHEN NEW.is_deleted = 1 AND OLD.is_deleted = 0
BEGIN
    UPDATE discussions 
    SET comment_count = comment_count - 1,
        updated_at = datetime('now')
    WHERE id = NEW.discussion_id;
END;

-- 트리거: 게시글 좋아요 수 자동 업데이트
CREATE TRIGGER IF NOT EXISTS update_discussion_like_count
AFTER INSERT ON discussion_likes
WHEN NEW.discussion_id IS NOT NULL
BEGIN
    UPDATE discussions 
    SET like_count = like_count + 1,
        updated_at = datetime('now')
    WHERE id = NEW.discussion_id;
END;

CREATE TRIGGER IF NOT EXISTS update_discussion_like_count_delete
AFTER DELETE ON discussion_likes
WHEN OLD.discussion_id IS NOT NULL
BEGIN
    UPDATE discussions 
    SET like_count = like_count - 1,
        updated_at = datetime('now')
    WHERE id = OLD.discussion_id;
END;

-- 트리거: 댓글 좋아요 수 자동 업데이트
CREATE TRIGGER IF NOT EXISTS update_comment_like_count
AFTER INSERT ON discussion_likes
WHEN NEW.comment_id IS NOT NULL
BEGIN
    UPDATE discussion_comments 
    SET like_count = like_count + 1,
        updated_at = datetime('now')
    WHERE id = NEW.comment_id;
END;

CREATE TRIGGER IF NOT EXISTS update_comment_like_count_delete
AFTER DELETE ON discussion_likes
WHEN OLD.comment_id IS NOT NULL
BEGIN
    UPDATE discussion_comments 
    SET like_count = like_count - 1,
        updated_at = datetime('now')
    WHERE id = OLD.comment_id;
END;

-- 기본 카테고리 데이터
INSERT OR IGNORE INTO discussion_categories (name, description, icon, color, sort_order) VALUES
    ('일반', '일반적인 성경 토론', '💬', '#3498db', 1),
    ('신학', '신학적 주제 토론', '📚', '#9b59b6', 2),
    ('묵상', '개인 묵상 나눔', '🙏', '#2ecc71', 3),
    ('질문', '성경 관련 질문', '❓', '#f39c12', 4),
    ('원어', '원어 분석 토론', '🔤', '#e74c3c', 5);

