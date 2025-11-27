// Cloudflare Workers API 서비스
const API_BASE_URL = 'https://macchain-api-public.daeheuigang.workers.dev';
class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    // 헬스체크
    async getHealth() {
        return this.request('/api/health');
    }
    // 오늘의 읽기 계획
    async getTodayPlan() {
        return this.request('/api/mccheyne/today');
    }
    // 사용자 로그인
    async login(email, password) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
    // 사용자 회원가입
    async register(email, password, name, nickname) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, nickname }),
        });
    }
    // 사용자 프로필
    async getUserProfile(token) {
        return this.request('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 통계
    async getUserStatistics(token) {
        return this.request('/api/statistics/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 읽기 진행률 조회
    async getReadingProgress(token, date) {
        return this.request(`/api/mccheyne/${date}/progress`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 읽기 진행률 업데이트
    async updateReadingProgress(token, date, readingId, isCompleted) {
        return this.request(`/api/mccheyne/${date}/progress`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ readingId, isCompleted }),
        });
    }
    // AI 분석
    async analyzePassage(token, passage, analysisType = 'general') {
        return this.request('/api/ai/analyze', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ passage, analysisType }),
        });
    }
    // 토론 목록 조회
    async getDiscussions(token, params) {
        const queryParams = new URLSearchParams();
        if (params?.categoryId)
            queryParams.append('categoryId', params.categoryId.toString());
        if (params?.page)
            queryParams.append('page', params.page.toString());
        if (params?.limit)
            queryParams.append('limit', params.limit.toString());
        if (params?.sort)
            queryParams.append('sort', params.sort);
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return this.request(`/api/discussions?${queryParams.toString()}`, {
            headers,
        });
    }
    // 토론 상세 조회
    async getDiscussion(token, discussionId) {
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return this.request(`/api/discussions/${discussionId}`, {
            headers,
        });
    }
    // 토론 작성
    async createDiscussion(token, data) {
        return this.request('/api/discussions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }
    // 토론 수정
    async updateDiscussion(token, discussionId, data) {
        return this.request(`/api/discussions/${discussionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }
    // 토론 삭제
    async deleteDiscussion(token, discussionId) {
        return this.request(`/api/discussions/${discussionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 카테고리 목록 조회
    async getCategories() {
        return this.request('/api/discussions/categories');
    }
    // 댓글 목록 조회
    async getComments(token, discussionId) {
        return this.request(`/api/discussions/${discussionId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 댓글 작성
    async createComment(token, discussionId, content, parentId) {
        return this.request(`/api/discussions/${discussionId}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content, parentId }),
        });
    }
    // 댓글 수정
    async updateComment(token, commentId, content) {
        return this.request(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        });
    }
    // 댓글 삭제
    async deleteComment(token, commentId) {
        return this.request(`/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 좋아요 토글 (게시글)
    async toggleDiscussionLike(token, discussionId) {
        return this.request(`/api/discussions/${discussionId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 좋아요 토글 (댓글)
    async toggleCommentLike(token, commentId) {
        return this.request(`/api/comments/${commentId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    // 북마크 토글
    async toggleBookmark(token, discussionId) {
        return this.request(`/api/discussions/${discussionId}/bookmark`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
}
export const apiService = new ApiService();
