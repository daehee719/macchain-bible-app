-- MacChain Supabase PostgreSQL Schema
-- Cloudflare D1 SQLite 스키마를 PostgreSQL로 변환

-- 사용자 테이블 (Supabase Auth의 auth.users와 연동)
-- Supabase Auth를 사용하므로 별도의 users 테이블은 프로필 정보만 저장
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 진행률 테이블
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_days_read INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    books_completed INTEGER DEFAULT 0,
    last_read_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MacChain 읽기 계획 테이블
CREATE TABLE IF NOT EXISTS public.macchain_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 읽기 진행률 테이블
CREATE TABLE IF NOT EXISTS public.reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    reading_id INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (plan_date) REFERENCES public.macchain_plan(date) ON DELETE CASCADE,
    UNIQUE(user_id, plan_date, reading_id)
);

-- 사용자 설정 테이블
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    reminder_time TIME DEFAULT '09:00',
    language TEXT DEFAULT 'ko',
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- AI 분석 결과 테이블
CREATE TABLE IF NOT EXISTS public.ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    reading_id INTEGER NOT NULL,
    analysis_type TEXT NOT NULL, -- 'word', 'verse', 'chapter'
    analysis_data JSONB NOT NULL, -- JSON 형태로 저장
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (plan_date) REFERENCES public.macchain_plan(date) ON DELETE CASCADE
);

-- 월별 성경 데이터 테이블
CREATE TABLE IF NOT EXISTS public.monthly_bible_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year, month, book, chapter, verse)
);

-- 사용자 동의 설정 테이블
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    privacy_consent BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    notification_consent BOOLEAN DEFAULT FALSE,
    age_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_macchain_plan_date ON public.macchain_plan(date);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_date ON public.reading_progress(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_reading_progress_completed ON public.reading_progress(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_user_date ON public.ai_analysis(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_monthly_bible_data_book_chapter ON public.monthly_bible_data(book, chapter);
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON public.user_consents(user_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON public.reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_consents_updated_at BEFORE UPDATE ON public.user_consents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 트리거: 사용자 생성 시 기본 설정 생성
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_settings_trigger
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_settings();

-- 트리거: 사용자 진행률 업데이트 시 통계 갱신
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
        UPDATE public.user_progress 
        SET 
            total_days_read = total_days_read + 1,
            last_read_date = NEW.plan_date,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_stats_trigger
    AFTER UPDATE ON public.reading_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- Row Level Security (RLS) 정책 설정
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reading progress" ON public.reading_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own reading progress" ON public.reading_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading progress" ON public.reading_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analysis" ON public.ai_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis" ON public.ai_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own consents" ON public.user_consents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own consents" ON public.user_consents
    FOR UPDATE USING (auth.uid() = user_id);

-- 공개 읽기 가능한 테이블 (읽기 계획, 성경 데이터)
-- macchain_plan과 monthly_bible_data는 모든 인증된 사용자가 읽을 수 있음
CREATE POLICY "Authenticated users can view reading plans" ON public.macchain_plan
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view bible data" ON public.monthly_bible_data
    FOR SELECT TO authenticated USING (true);


