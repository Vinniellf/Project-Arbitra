import {
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  confirmSignIn
} from "aws-amplify/auth";

export const authService = {

  // 🔐 LOGIN
  async login(email: string, password: string): Promise<{
    requiresNewPassword: boolean;
  }> {
    try {
      const result = await signIn({
        username: email,
        password,
      });

      return {
        requiresNewPassword:
          result.nextStep?.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED",
      };

    } catch (error: unknown) {

      // 🔁 Si ya hay sesión activa, cerramos y reintentamos
      if (
        error instanceof Error &&
        error.name === "UserAlreadyAuthenticatedException"
      ) {
        await signOut();
        return this.login(email, password);
      }

      throw error;
    }
  },

  // 🆕 🔐 CAMBIO DE CONTRASEÑA (INVITACIÓN / PRIMER LOGIN)
  async confirmNewPassword(newPassword: string) {
    try {
      await confirmSignIn({
        challengeResponse: newPassword,
      });
    } catch (error: unknown) {
      console.error("Error cambiando contraseña inicial:", error);
      throw error;
    }
  },

  // 📩 FORGOT PASSWORD (opcional)
  async forgotPassword(email: string) {
    try {
      await resetPassword({
        username: email,
      });
    } catch (error: unknown) {
      console.error("Error enviando correo:", error);
      throw error;
    }
  },

  // 🔐 CONFIRMAR RESET PASSWORD (opcional)
  async confirmReset(email: string, code: string, newPassword: string) {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error: unknown) {
      console.error("Error confirmando reset:", error);
      throw error;
    }
  },

  // 🚪 LOGOUT
  async logout() {
    try {
      await signOut();
    } catch (error: unknown) {
      console.warn("Error en logout:", error);
    }
  },
};
