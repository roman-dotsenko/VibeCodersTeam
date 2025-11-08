export interface User {
  email: string;
  name: string;
  givenName?: string;
  surname?: string;
  picture?: string;
  isAuthenticated: boolean;
}

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:7018';
};

export const authService = {
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  clearAuth: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },

  // Check authentication status with backend
  checkAuth: async (): Promise<User | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        credentials: 'include', // Include cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated) {
          authService.setUser(data);
          return data;
        }
      }
      
      // Clear any stale user data
      authService.clearAuth();
      return null;
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.clearAuth();
      return null;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    
    try {
      const backendUrl = getBackendUrl();
      await fetch(`${backendUrl}/api/auth/logout`, {
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      authService.clearAuth();
    }
  },
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // For cookie-based auth, just include credentials
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
};
