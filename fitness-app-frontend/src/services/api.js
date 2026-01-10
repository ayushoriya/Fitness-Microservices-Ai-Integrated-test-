

// export default api;
import axios from "axios";

// ✅ ALL TRAFFIC THROUGH GATEWAY (Port 8080)
const GATEWAY_URL = 'http://localhost:8080/api';

// Main API instance (calls gateway for all routes)
const api = axios.create({
    baseURL: GATEWAY_URL,
    timeout: 15000, // 15s global timeout, adjust as needed
});

// Request interceptor: adds tokens, userId
api.interceptors.request.use(
    (config) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        if (userId) config.headers['X-User-ID'] = userId;
        // Optional: debug logging
        // console.log('[GW] Request:', config.method, config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: logging
api.interceptors.response.use(
    (response) => {
        // console.log('[GW] Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        // console.error('[GW] Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

// ==============================================
// ACTIVITY APIs
// ==============================================
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);

// ==============================================
// TEMPLATES APIs
// ==============================================
export const getPublicTemplates = () => api.get('/templates/public');
export const getMyTemplates = () => api.get('/templates/my');
export const getTemplatesByCategory = (category) => api.get(`/templates/category/${category}`);
export const getTemplateById = (id) => api.get(`/templates/${id}`);
export const createTemplate = (data) => api.post('/templates', data);
export const deleteTemplate = (id) => api.delete(`/templates/${id}`);

// ==============================================
// WORKOUT SESSION APIs
// ==============================================
export const startWorkoutSession = (templateId) =>
    api.post('/workout-sessions/start', { templateId });
export const getActiveWorkout = () => api.get('/workout-sessions/active');
export const completeExercise = (data) =>
    api.put('/workout-sessions/exercise/complete', data);
export const completeWorkout = (sessionId) =>
    api.put(`/workout-sessions/${sessionId}/complete`);
export const abandonWorkout = (sessionId) =>
    api.put(`/workout-sessions/${sessionId}/abandon`);
export const getWorkoutHistory = () => api.get('/workout-sessions/history');

// ==============================================
// AI (RECOMMENDATION) APIs
// ==============================================
export const getRecommendationByActivity = (activityId) =>
    api.get(`/recommendations/activity/${activityId}`);
export const getUserRecommendations = () => 
    api.get('/recommendations/user');
export const checkRecommendationStatus = (activityId) =>
    api.get(`/recommendations/status/${activityId}`);

// ==============================================
// USER APIs
// ==============================================
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);

export default api;
