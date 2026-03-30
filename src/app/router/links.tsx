import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { HomePage } from "@/modules/home/pages/home-page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
];
