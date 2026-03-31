import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const user = localStorage.getItem("user");

  // Si no hay usuario, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, permite acceso
  return <>{children}</>;
};
