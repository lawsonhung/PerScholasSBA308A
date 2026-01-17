import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL: string = "https://pokeapi.co/api/v2";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

// Interceptors
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Example: Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Logic to refresh token or redirect to login
      console.log("Unauthorized, handling...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;