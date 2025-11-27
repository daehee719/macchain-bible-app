import Button from '../components/ui/Button';
// Cloudflare Workers API 서비스
const API_BASE_URL = 'https://macchain-api-public.daeheuigang.workers.dev';

export interface ReadingPlan {
  id: number;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
}

export interface TodayPlanResponse {
  success: boolean;
  date: string;
  readings: ReadingPlan[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  environment: string;
}

export interface Discussion {
  id: string;
  user_id: number;
  title: string;
  content: string;
  passage_reference?: string;
  passage_text?: string;
  category_id?: number;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author_nickname: string;
  author_name: string;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_author?: boolean;
}

export interface Comment {
  id: string;
  discussion_id: string;
  user_id: number;
  parent_id?: string;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  author_nickname: string;
  author_name: string;
  is_liked?: boolean;
  is_author?: boolean;
  replies?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
}

export interface DiscussionsResponse {
  success: boolean;
  data: {
    discussions: Discussion[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DiscussionResponse {
  success: boolean;
  data: {
    discussion: Discussion;
  };
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
  };
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/health');
  }

  // 오늘의 읽기 계획
  async getTodayPlan(): Promise<TodayPlanResponse> {
    return this.request<TodayPlanResponse>('/api/mccheyne/today');
  }

  // 사용자 로그인
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // 사용자 회원가입
  async register(email: string, password: string, name: string, nickname: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, nickname }),
    });
  }

  // 사용자 프로필
  async getUserProfile(token: string) {
    return this.request('/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 통계
  async getUserStatistics(token: string) {
    return this.request('/api/statistics/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 읽기 진행률 조회
  async getReadingProgress(token: string, date: string) {
    return this.request(`/api/mccheyne/${date}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 읽기 진행률 업데이트
  async updateReadingProgress(token: string, date: string, readingId: number, isCompleted: boolean) {
    return this.request(`/api/mccheyne/${date}/progress`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ readingId, isCompleted }),
    });
  }

  // AI 분석
  async analyzePassage(token: string, passage: string, analysisType: string = 'general') {
    return this.request('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ passage, analysisType }),
    });
  }

  // 토론 목록 조회
  async getDiscussions(token: string | null, params?: { categoryId?: number; page?: number; limit?: number; sort?: string }): Promise<DiscussionsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<DiscussionsResponse>(`/api/discussions?${queryParams.toString()}`, {
      headers,
    });
  }

  // 토론 상세 조회
  async getDiscussion(token: string | null, discussionId: string): Promise<DiscussionResponse> {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<DiscussionResponse>(`/api/discussions/${discussionId}`, {
      headers,
    });
  }

  // 토론 작성
  async createDiscussion(token: string, data: { title: string; content: string; passageReference?: string; passageText?: string; categoryId?: number }): Promise<{ success: boolean; data?: any; message?: string }> {
    return this.request('/api/discussions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // 토론 수정
  async updateDiscussion(token: string, discussionId: string, data: { title: string; content: string; passageReference?: string; passageText?: string; categoryId?: number }) {
    return this.request(`/api/discussions/${discussionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // 토론 삭제
  async deleteDiscussion(token: string, discussionId: string) {
    return this.request(`/api/discussions/${discussionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 카테고리 목록 조회
  async getCategories(): Promise<CategoriesResponse> {
    return this.request<CategoriesResponse>('/api/discussions/categories');
  }

  // 댓글 목록 조회
  async getComments(token: string, discussionId: string): Promise<CommentsResponse> {
    return this.request<CommentsResponse>(`/api/discussions/${discussionId}/comments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 댓글 작성
  async createComment(token: string, discussionId: string, content: string, parentId?: string) {
    return this.request(`/api/discussions/${discussionId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parentId }),
    });
  }

  // 댓글 수정
  async updateComment(token: string, commentId: string, content: string) {
    return this.request(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
  }

  // 댓글 삭제
  async deleteComment(token: string, commentId: string) {
    return this.request(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 좋아요 토글 (게시글)
  async toggleDiscussionLike(token: string, discussionId: string) {
    return this.request(`/api/discussions/${discussionId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 좋아요 토글 (댓글)
  async toggleCommentLike(token: string, commentId: string) {
    return this.request(`/api/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 북마크 토글
  async toggleBookmark(token: string, discussionId: string) {
    return this.request(`/api/discussions/${discussionId}/bookmark`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
