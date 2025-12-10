-- 좋아요(아멘) 토글 최적화를 위한 PostgreSQL 함수
-- 한 번의 호출로 SELECT 없이 INSERT/DELETE를 원자적으로 처리

CREATE OR REPLACE FUNCTION toggle_community_like(
    p_post_id UUID,
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- 먼저 존재 여부 확인 (인덱스 사용으로 빠름)
    SELECT EXISTS(
        SELECT 1 
        FROM public.community_likes 
        WHERE post_id = p_post_id AND user_id = p_user_id
    ) INTO v_exists;
    
    IF v_exists THEN
        -- 이미 좋아요가 있으면 삭제
        DELETE FROM public.community_likes
        WHERE post_id = p_post_id AND user_id = p_user_id;
        RETURN FALSE; -- 좋아요 취소
    ELSE
        -- 좋아요가 없으면 추가
        INSERT INTO public.community_likes (post_id, user_id)
        VALUES (p_post_id, p_user_id)
        ON CONFLICT (post_id, user_id) DO NOTHING; -- 동시성 보장
        RETURN TRUE; -- 좋아요 추가
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- 에러 발생 시 롤백
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS 정책: 인증된 사용자만 실행 가능
GRANT EXECUTE ON FUNCTION toggle_community_like(UUID, UUID) TO authenticated;

-- 함수 설명
COMMENT ON FUNCTION toggle_community_like IS '커뮤니티 나눔의 좋아요(아멘)를 토글합니다. 원자적 연산으로 중복 요청을 방지합니다.';

