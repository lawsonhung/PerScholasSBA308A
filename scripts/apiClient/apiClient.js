import axios, { AxiosError } from 'axios';
const API_BASE_URL = "https://pokeapi.co/api/v2";
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});
// Interceptors
apiClient.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});
apiClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    // Example: Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
        // Logic to refresh token or redirect to login
        console.log("Unauthorized, handling...");
    }
    return Promise.reject(error);
});
export default apiClient;
//# sourceMappingURL=apiClient.js.map