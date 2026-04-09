import { useState } from "react";
import { authService } from "../services/auth.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // LOGIN
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await authService.login(email, password);
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO DE CONTRASEÑA (INVITACIÓN / PRIMER LOGIN)
  const confirmNewPassword = async (password: string) => {
    setLoading(true);
    try {
      return await authService.confirmNewPassword(password);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NUEVO: ACTUALIZAR PERFIL (NAME)
  const updateProfile = async (data: { name?: string }) => {
    setLoading(true);
    try {
      return await authService.updateProfile(data);
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      return await authService.forgotPassword(email);
    } finally {
      setLoading(false);
    }
  };

  // CONFIRMAR RESET PASSWORD
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

  // LOGOUT
  const logout = async () => {
    return await authService.logout();
  };

  return {
    login,
    confirmNewPassword,

    updateProfile,

    forgotPassword,
    confirmReset,
    logout,
    loading,
  };
};
