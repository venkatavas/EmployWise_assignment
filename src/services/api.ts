import axios from 'axios';
import { LoginCredentials, LoginResponse, UsersResponse, UpdateUserData, User } from '../types';

const BASE_URL = 'https://reqres.in/api';

const api = axios.create({
    baseURL: BASE_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
};

export const getUsers = async (page: number = 1): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>(`/users?page=${page}`);
    return response.data;
};

export const getUser = async (id: number): Promise<{ data: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
    // Simulate successful update
    return {
        id,
        ...data,
        avatar: `https://reqres.in/img/faces/${id}-image.jpg`,
    };
};

export const deleteUser = async (id: number): Promise<void> => {
    // Simulate successful deletion
    return Promise.resolve();
}; 