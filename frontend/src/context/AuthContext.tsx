import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../services/types';
import { api, getWebSocketUrl } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: Role;
  demoMode: boolean;
  loginAs: (email: string) => Promise<void>;
  switchRole: (newRole: Role) => void;
  logout: () => void;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: React.Dispatch<React.SetStateAction<number>>;
  realtimeConnected: boolean;
}

const DEFAULT_USER: User = {
  id: 1,
  email: 'naveen@sasurie.edu.in',
  full_name: 'Naveen (Student)',
  role: 'student',
  department: 'Computer Science & Engineering',
  student_id_code: 'SCE-2026-CS042',
  is_demo_user: true
};

// Cookie Helpers
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check saved cookie or localStorage for quick initialization
    const savedEmail = getCookie('user_email') || (typeof window !== 'undefined' ? localStorage.getItem('user_email') : null);
    if (savedEmail?.includes('faculty')) {
      return {
        id: 2,
        email: 'faculty@sasurie.edu.in',
        full_name: 'Dr. Aris (Faculty Mentor)',
        role: 'faculty',
        department: 'Computer Science & Engineering',
        student_id_code: 'FAC-8802',
        is_demo_user: true
      };
    }
    if (savedEmail?.includes('admin')) {
      return {
        id: 3,
        email: 'admin@sasurie.edu.in',
        full_name: 'System Admin',
        role: 'admin',
        department: 'Academic Operations',
        student_id_code: 'ADM-0001',
        is_demo_user: true
      };
    }
    if (savedEmail) {
      return DEFAULT_USER;
    }
    return DEFAULT_USER; // Default for instant access
  });

  const [role, setRole] = useState<Role>(user ? user.role : 'student');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(3);
  const [realtimeConnected, setRealtimeConnected] = useState<boolean>(false);

  useEffect(() => {
    // Try fetching current authenticated user profile on mount
    api.getMe()
      .then((userData) => {
        setUser(userData);
        setRole(userData.role);
        setCookie('user_email', userData.email);
        setCookie('user_role', userData.role);
      })
      .catch(() => {
        // Fallback initialized state
      });
  }, []);

  // Real-time WebSocket connection engine
  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: ReturnType<typeof setInterval> | null = null;

    try {
      const wsUrl = getWebSocketUrl();
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setRealtimeConnected(true);
        pingInterval = setInterval(() => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send('ping');
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NOTIFICATION' || data.type === 'ALERT') {
            setUnreadNotificationsCount(prev => prev + 1);
          }
        } catch {
          // Non-JSON ping echo
        }
      };

      ws.onclose = () => {
        setRealtimeConnected(false);
        if (pingInterval) clearInterval(pingInterval);
      };

      ws.onerror = () => {
        setRealtimeConnected(false);
      };
    } catch (err) {
      console.warn('Real-time WebSocket initialization note:', err);
    }

    return () => {
      if (pingInterval) clearInterval(pingInterval);
      if (ws) ws.close();
    };
  }, []);

  const loginAs = async (email: string) => {
    // Save email into cookies and localStorage
    setCookie('user_email', email);
    setCookie('auth_token', `demo_token_${Date.now()}`);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_email', email);
    }

    try {
      const res = await api.login(email);
      setUser(res.user);
      setRole(res.user.role);
      setCookie('user_role', res.user.role);
    } catch {
      if (email.includes('faculty') || email.includes('aris')) {
        const facUser: User = {
          id: 2,
          email: 'faculty@sasurie.edu.in',
          full_name: 'Dr. Aris (Faculty Mentor)',
          role: 'faculty',
          department: 'Computer Science & Engineering',
          student_id_code: 'FAC-8802',
          is_demo_user: true
        };
        setUser(facUser);
        setRole('faculty');
        setCookie('user_role', 'faculty');
      } else if (email.includes('admin')) {
        const admUser: User = {
          id: 3,
          email: 'admin@sasurie.edu.in',
          full_name: 'System Admin',
          role: 'admin',
          department: 'Academic Operations',
          student_id_code: 'ADM-0001',
          is_demo_user: true
        };
        setUser(admUser);
        setRole('admin');
        setCookie('user_role', 'admin');
      } else {
        setUser(DEFAULT_USER);
        setRole('student');
        setCookie('user_role', 'student');
      }
    }
  };

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    setCookie('user_role', newRole);
    if (newRole === 'faculty') {
      setUser({
        id: 2,
        email: 'faculty@sasurie.edu.in',
        full_name: 'Dr. Aris (Faculty Mentor)',
        role: 'faculty',
        department: 'Computer Science & Engineering',
        student_id_code: 'FAC-8802',
        is_demo_user: true
      });
    } else if (newRole === 'admin') {
      setUser({
        id: 3,
        email: 'admin@sasurie.edu.in',
        full_name: 'System Admin',
        role: 'admin',
        department: 'Academic Operations',
        student_id_code: 'ADM-0001',
        is_demo_user: true
      });
    } else {
      setUser(DEFAULT_USER);
    }
  };

  const logout = () => {
    // Clear cookies & storage
    deleteCookie('user_email');
    deleteCookie('user_role');
    deleteCookie('auth_token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_email');
    }
    api.logout().catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        demoMode,
        loginAs,
        switchRole,
        logout,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        realtimeConnected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
