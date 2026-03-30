import { Route, Routes } from "react-router-dom";
import { routes } from "./links";
import { MainLayout } from "../layouts/MainLayout";

export const RoutesApp = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {routes.map((route) => (
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
