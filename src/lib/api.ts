// API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to handle API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (fullName: string, email: string, password: string, role: string) =>
    apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, role }),
    }),

  getCurrentUser: () => apiRequest("/user"),
};

// User profile type
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

// User API (can be extended for user management)
export const userApi = {
  getProfile: () => apiRequest("/user"),

  updateProfile: (userData: Partial<UserProfile>) =>
    apiRequest("/user", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

// Default export of all API functions
export default {
  auth: authApi,
  user: userApi,
};
