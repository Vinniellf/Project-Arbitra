import { useState } from "react";
import { loginService } from "../services/auth.service";
import type { User } from "../types/user";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Campos obligatorios");
      }

      const user = loginService(email, password);

      if (!user) {
        return null;
      }

      if (user.estado !== "ACTIVO") {
        throw new Error("Usuario inactivo");
      }

      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
  };
};
