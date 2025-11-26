import Button from 'src/components/ui/Button';
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
}
export const apiService = new ApiService();
