import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import AuthPage from "@/modules/auth/pages/auth-page";
import { HomePage } from "@/modules/home/pages/home-page";
import { AuthGuard } from "@/shared/guards/AuthGuard";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
];

export const privateRoutes: RouteObject[] = [
  {
    path: "/home",
    element: (
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    ),
  },
];
