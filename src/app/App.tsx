import { BrowserRouter } from "react-router-dom";
import { RoutesApp } from "./router/routes";
import { AuthProvider } from "@/modules/auth/context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
