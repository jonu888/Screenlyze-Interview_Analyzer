import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('token', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

class ApiService {
    // Authentication methods
    static async register(userData) {
        const response = await api.post('/register/', userData);
        return response.data;
    }

    static async login(email, password) {
        const response = await api.post('/login/', { email, password });
        const { access, refresh } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        return response.data;
    }

    static async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    // Video analysis with upload progress
    static async analyzeVideo(videoFile, candidateName, onUploadProgress = null) {
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('candidate_name', candidateName);

        const response = await api.post('/analyze/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });

        return response.data;
    }

    // Fetch all analyses
    static async getAnalyses() {
        const response = await api.get('/analyses/');
        return response.data;
    }

    static async getAnalysisById(id) {
        const response = await api.get(`/analyses/${id}/`);
        return response.data;
    }

    // Profile methods
    static async getProfile() {
        console.log('Fetching profile from URL:', 'http://localhost:8000/api/profile/');
        const response = await api.get('http://localhost:8000/api/profile/');
        return response.data;
    }

    static async updateProfile(profileData) {
        const response = await api.put('http://localhost:8000/api/profile/', profileData);
        return response.data;
    }

    static async searchInterviewQuestions(query) {
        const response = await api.get(`/interview-questions/search/?query=${encodeURIComponent(query)}`);
        return response.data;
    }
}

export default ApiService;
