-- user_settings 테이블에 INSERT 정책 추가
-- users 테이블에 INSERT 시 트리거가 user_settings에도 INSERT를 시도하는데
-- RLS 정책이 없어서 실패하는 문제 해결

CREATE POLICY "Users can insert own settings" 
ON public.user_settings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

