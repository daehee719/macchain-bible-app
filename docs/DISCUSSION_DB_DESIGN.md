# 토론 기능 데이터베이스 설계

## 🎯 요구사항 분석

토론 기능에 필요한 기능들:
1. **토론 게시글** - 성경 구절에 대한 토론
2. **댓글** - 게시글에 대한 댓글 및 대댓글
3. **좋아요/추천** - 게시글 및 댓글 추천
4. **카테고리** - 토론 주제 분류
5. **북마크** - 관심 있는 토론 저장
6. **신고** - 부적절한 내용 신고

## 📊 데이터베이스 스키마 설계

### 1. 토론 게시글 테이블 (discussions)

```sql
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

CREATE INDEX idx_discussions_user_id ON discussions(user_id);
CREATE INDEX idx_discussions_category_id ON discussions(category_id);
CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX idx_discussions_is_pinned ON discussions(is_pinned DESC, created_at DESC);
```

**필드 설명:**
- `id`: UUID 또는 타임스탬프 기반 고유 ID
- `user_id`: 작성자 ID
- `title`: 토론 제목
- `content`: 토론 내용 (마크다운 지원 가능)
- `passage_reference`: 성경 구절 참조 (예: "요한복음 3:16")
- `passage_text`: 성경 구절 본문
- `category_id`: 카테고리 (선택적)
- `view_count`: 조회수
- `like_count`: 좋아요 수 (캐시)
- `comment_count`: 댓글 수 (캐시)
- `is_pinned`: 고정 게시글 여부
- `is_locked`: 댓글 잠금 여부
- `is_deleted`: 삭제 여부 (소프트 삭제)

### 2. 토론 카테고리 테이블 (discussion_categories)

```sql
CREATE TABLE IF NOT EXISTS discussion_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,  -- 아이콘 이름 또는 이모지
    color TEXT,  -- 카테고리 색상
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 기본 카테고리 데이터
INSERT INTO discussion_categories (name, description, icon, color, sort_order) VALUES
    ('일반', '일반적인 성경 토론', '💬', '#3498db', 1),
    ('신학', '신학적 주제 토론', '📚', '#9b59b6', 2),
    ('묵상', '개인 묵상 나눔', '🙏', '#2ecc71', 3),
    ('질문', '성경 관련 질문', '❓', '#f39c12', 4),
    ('원어', '원어 분석 토론', '🔤', '#e74c3c', 5);
```

### 3. 댓글 테이블 (discussion_comments)

```sql
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

CREATE INDEX idx_comments_discussion_id ON discussion_comments(discussion_id);
CREATE INDEX idx_comments_user_id ON discussion_comments(user_id);
CREATE INDEX idx_comments_parent_id ON discussion_comments(parent_id);
CREATE INDEX idx_comments_created_at ON discussion_comments(created_at);
```

**필드 설명:**
- `id`: 댓글 고유 ID
- `discussion_id`: 토론 게시글 ID
- `user_id`: 작성자 ID
- `parent_id`: 대댓글인 경우 부모 댓글 ID (NULL이면 최상위 댓글)
- `content`: 댓글 내용
- `like_count`: 좋아요 수 (캐시)
- `is_deleted`: 삭제 여부 (소프트 삭제)

### 4. 좋아요 테이블 (discussion_likes)

```sql
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

CREATE UNIQUE INDEX idx_likes_user_discussion ON discussion_likes(user_id, discussion_id) 
    WHERE discussion_id IS NOT NULL;
CREATE UNIQUE INDEX idx_likes_user_comment ON discussion_likes(user_id, comment_id) 
    WHERE comment_id IS NOT NULL;
CREATE INDEX idx_likes_discussion_id ON discussion_likes(discussion_id);
CREATE INDEX idx_likes_comment_id ON discussion_likes(comment_id);
```

**필드 설명:**
- `id`: 좋아요 고유 ID
- `user_id`: 좋아요를 누른 사용자 ID
- `discussion_id`: 게시글 ID (게시글 좋아요인 경우)
- `comment_id`: 댓글 ID (댓글 좋아요인 경우)
- 둘 중 하나만 있어야 함 (CHECK 제약조건)

### 5. 북마크 테이블 (discussion_bookmarks)

```sql
CREATE TABLE IF NOT EXISTS discussion_bookmarks (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    discussion_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    UNIQUE(user_id, discussion_id)
);

CREATE INDEX idx_bookmarks_user_id ON discussion_bookmarks(user_id);
CREATE INDEX idx_bookmarks_discussion_id ON discussion_bookmarks(discussion_id);
```

### 6. 신고 테이블 (discussion_reports)

```sql
CREATE TABLE IF NOT EXISTS discussion_reports (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,  -- 신고한 사용자
    discussion_id TEXT,        -- 신고된 게시글
    comment_id TEXT,           -- 신고된 댓글
    reason TEXT NOT NULL,      -- 신고 사유
    description TEXT,          -- 상세 설명
    status TEXT DEFAULT 'pending',  -- pending, reviewed, resolved, rejected
    reviewed_by INTEGER,       -- 검토한 관리자 ID
    reviewed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES discussion_comments(id) ON DELETE CASCADE,
    CHECK ((discussion_id IS NOT NULL AND comment_id IS NULL) OR 
           (discussion_id IS NULL AND comment_id IS NOT NULL))
);

CREATE INDEX idx_reports_status ON discussion_reports(status);
CREATE INDEX idx_reports_created_at ON discussion_reports(created_at);
```

## 🔄 트리거 (자동 업데이트)

### 댓글 수 자동 업데이트

```sql
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
```

### 좋아요 수 자동 업데이트

```sql
-- 게시글 좋아요
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

-- 댓글 좋아요
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
```

### 조회수 업데이트 (수동으로 처리하는 것이 좋음)

조회수는 트리거 대신 API에서 직접 업데이트하는 것을 권장합니다.
(중복 조회 방지, 사용자별 조회 기록 등 고려)

## 📋 전체 스키마 파일

```sql
-- 토론 기능 스키마
-- backend/cloudflare-workers/database/discussion-schema.sql

-- 1. 카테고리
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

-- 2. 토론 게시글
CREATE TABLE IF NOT EXISTS discussions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    passage_reference TEXT,
    passage_text TEXT,
    category_id INTEGER,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT 0,
    is_locked BOOLEAN DEFAULT 0,
    is_deleted BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES discussion_categories(id) ON DELETE SET NULL
);

-- 3. 댓글
CREATE TABLE IF NOT EXISTS discussion_comments (
    id TEXT PRIMARY KEY,
    discussion_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id TEXT,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES discussion_comments(id) ON DELETE CASCADE
);

-- 4. 좋아요
CREATE TABLE IF NOT EXISTS discussion_likes (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    discussion_id TEXT,
    comment_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES discussion_comments(id) ON DELETE CASCADE,
    CHECK ((discussion_id IS NOT NULL AND comment_id IS NULL) OR 
           (discussion_id IS NULL AND comment_id IS NOT NULL))
);

-- 5. 북마크
CREATE TABLE IF NOT EXISTS discussion_bookmarks (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    discussion_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    UNIQUE(user_id, discussion_id)
);

-- 6. 신고
CREATE TABLE IF NOT EXISTS discussion_reports (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    discussion_id TEXT,
    comment_id TEXT,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    reviewed_by INTEGER,
    reviewed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES discussion_comments(id) ON DELETE CASCADE,
    CHECK ((discussion_id IS NOT NULL AND comment_id IS NULL) OR 
           (discussion_id IS NULL AND comment_id IS NOT NULL))
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_category_id ON discussions(category_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_is_pinned ON discussions(is_pinned DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_discussion_id ON discussion_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON discussion_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON discussion_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON discussion_comments(created_at);

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

-- 트리거
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
```

## 🎯 설계 고려사항

### 1. **소프트 삭제 (Soft Delete)**
- `is_deleted` 플래그 사용
- 실제 데이터는 유지하되 표시만 안 함
- 복구 가능, 통계 유지

### 2. **캐시된 카운트**
- `like_count`, `comment_count`는 트리거로 자동 업데이트
- 매번 COUNT 쿼리하지 않아 성능 향상

### 3. **인덱스 최적화**
- 자주 조회되는 필드에 인덱스 생성
- 정렬이 많은 `created_at`에 인덱스

### 4. **외래 키 제약조건**
- 데이터 무결성 보장
- CASCADE 삭제로 관련 데이터 자동 정리

### 5. **대댓글 구조**
- `parent_id`로 계층 구조 구현
- 최대 깊이 제한 권장 (예: 3단계)

## 📝 API 엔드포인트 제안

```
GET    /api/discussions              # 토론 목록
POST   /api/discussions              # 토론 작성
GET    /api/discussions/:id          # 토론 상세
PUT    /api/discussions/:id         # 토론 수정
DELETE /api/discussions/:id         # 토론 삭제

GET    /api/discussions/:id/comments    # 댓글 목록
POST   /api/discussions/:id/comments    # 댓글 작성
PUT    /api/comments/:id                # 댓글 수정
DELETE /api/comments/:id                # 댓글 삭제

POST   /api/discussions/:id/like        # 게시글 좋아요
DELETE /api/discussions/:id/like        # 게시글 좋아요 취소
POST   /api/comments/:id/like           # 댓글 좋아요
DELETE /api/comments/:id/like           # 댓글 좋아요 취소

POST   /api/discussions/:id/bookmark    # 북마크 추가
DELETE /api/discussions/:id/bookmark    # 북마크 삭제
GET    /api/users/me/bookmarks          # 내 북마크 목록

GET    /api/discussions/categories      # 카테고리 목록
```

## 🔍 성능 최적화 팁

1. **페이지네이션**: LIMIT/OFFSET 사용
2. **조회수**: 중복 조회 방지 (쿠키/세션)
3. **댓글 로딩**: 대댓글은 필요시에만 로드 (Lazy Loading)
4. **캐싱**: 인기 게시글은 KV에 캐싱 고려

