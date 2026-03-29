import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/signin')) {
            // Clear cookie and redirect
            document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default api;
