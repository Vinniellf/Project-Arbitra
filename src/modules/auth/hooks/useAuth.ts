import { useState } from "react";
import { authService } from "../services/auth.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      return await authService.login(email, password);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 🔐 CAMBIO DE CONTRASEÑA (INVITACIÓN / PRIMER LOGIN)
  const confirmNewPassword = async (password: string) => {
    setLoading(true);

    try {
      return await authService.confirmNewPassword(password);
    } finally {
      setLoading(false);
    }
  };

  // 📩 FORGOT PASSWORD (opcional)
  const forgotPassword = async (email: string) => {
    setLoading(true);

    try {
      return await authService.forgotPassword(email);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 CONFIRMAR RESET PASSWORD (opcional)
  const confirmReset = async (
    email: string,
    code: string,
    password: string
  ) => {
    setLoading(true);

    try {
      return await authService.confirmReset(email, code, password);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    return await authService.logout();
  };

  return {
    login,

    // 🔥 NUEVO (clave para invitación Cognito)
    confirmNewPassword,

    // 🔹 opcionales (forgot password)
    forgotPassword,
    confirmReset,

    logout,
    loading,
  };
};
