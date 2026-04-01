import { useEffect, useState, useCallback } from "react";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { logout: serviceLogout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // cargar usuario desde Cognito
  const loadUser = useCallback(async () => {
    try {
      await getCurrentUser(); // valida sesión

      const attributes = await fetchUserAttributes();

      setUser({
        name: attributes.name || attributes.email,
        email: attributes.email,
      });

    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // init app
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // refrescar usuario (post-login)
  const refreshUser = async () => {
    setLoading(true);
    await loadUser();
  };

  // logout global
  const logout = async () => {
    await serviceLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
