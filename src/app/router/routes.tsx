import { Route, Routes } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./links";
import { MainLayout } from "../layouts/MainLayout";

export const RoutesApp = () => {
  return (
    <Routes>

      {/* RUTAS PUBLICAS (SIN LAYOUT) */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}

      {/* RUTAS PRIVADAS (CON LAYOUT) */}
      <Route element={<MainLayout />}>
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>

    </Routes>
  );
};
