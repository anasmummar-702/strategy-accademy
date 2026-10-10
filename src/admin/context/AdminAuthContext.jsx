import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi, getAuthToken, setAuthToken } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export const DEFAULT_SUPER_ADMIN = {
  id: 'usr_superadmin_01',
  email: 'admin@strategy.ae',
  fullName: 'Executive Owner',
  role: 'super_admin',
  roleName: 'Administrator',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  permissions: ['*']
};

export const DEFAULT_STORE_ADMIN = {
  id: 'usr_storeadmin_02',
  email: 'store@strategy.ae',
  fullName: 'E-Commerce Store Admin',
  role: 'store_admin',
  roleName: 'Store Administrator',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  permissions: ['products', 'categories', 'collections', 'orders', 'customers', 'coupons', 'reviews', 'settings']
};

export const DEFAULT_DEV_ADMIN = DEFAULT_SUPER_ADMIN;

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial authentication check on load
  useEffect(() => {
    const checkAuth = async () => {
      // Check saved demo session first
      const savedDemo = localStorage.getItem('strategy_admin_demo_user');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          if (parsed && parsed.role) {
            if (parsed.role === 'super_admin') {
              parsed.roleName = 'Administrator';
            }
            setAdmin(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Continue to token check
        }
      }

      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profileData = await adminApi.me();
        setAdmin(profileData.user || profileData);
      } catch (err) {
        console.warn('Backend auth check failed or server offline:', err.message);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    const normalizedEmail = (email || '').trim().toLowerCase();

    try {
      // Try backend API first
      const data = await adminApi.login(email, password);
      setAdmin(data.user);
      localStorage.setItem('strategy_admin_demo_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      console.warn('API login failed, evaluating demo login:', err.message);

      // Check if Store Admin
      if (
        normalizedEmail === 'store@strategy.ae' ||
        normalizedEmail === 'manager@strategy.ae' ||
        normalizedEmail.includes('store') ||
        password === 'store123'
      ) {
        const storeUser = {
          ...DEFAULT_STORE_ADMIN,
          email: normalizedEmail || DEFAULT_STORE_ADMIN.email,
        };
        setAdmin(storeUser);
        setAuthToken('demo_jwt_token_strategy_store_admin');
        localStorage.setItem('strategy_admin_demo_user', JSON.stringify(storeUser));
        setLoading(false);
        return { success: true, user: storeUser };
      }

      // Check if Super Admin / standard demo login
      if (
        normalizedEmail === 'admin@strategy.ae' ||
        normalizedEmail === 'owner@strategy.ae' ||
        password === 'admin123' ||
        password === 'admin' ||
        !normalizedEmail
      ) {
        const superUser = {
          ...DEFAULT_SUPER_ADMIN,
          email: normalizedEmail || DEFAULT_SUPER_ADMIN.email,
        };
        setAdmin(superUser);
        setAuthToken('demo_jwt_token_strategy_super_admin');
        localStorage.setItem('strategy_admin_demo_user', JSON.stringify(superUser));
        setLoading(false);
        return { success: true, user: superUser };
      }

      setError(err.message || 'Invalid email or password');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const switchDemoRole = (role) => {
    const newUser = role === 'store_admin' ? DEFAULT_STORE_ADMIN : DEFAULT_SUPER_ADMIN;
    setAdmin(newUser);
    const token = role === 'store_admin' ? 'demo_jwt_token_strategy_store_admin' : 'demo_jwt_token_strategy_super_admin';
    setAuthToken(token);
    localStorage.setItem('strategy_admin_demo_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setLoading(true);
    try {
      await adminApi.logout();
    } catch (e) {
      // Ignore
    } finally {
      setAdmin(null);
      setAuthToken(null);
      localStorage.removeItem('strategy_admin_demo_user');
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    if (!admin) return false;
    if (admin.role === 'super_admin' || (admin.permissions && admin.permissions.includes('*'))) {
      return true;
    }
    return admin.permissions?.includes(permission) || false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        error,
        isAuthenticated: !!admin,
        login,
        logout,
        switchDemoRole,
        hasPermission,
        setAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
