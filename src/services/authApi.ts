import axios from 'axios';

const API_BASE_URL = 'https://api.escuelajs.co/api/v1';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (accessToken: string): Promise<UserProfile> => {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};