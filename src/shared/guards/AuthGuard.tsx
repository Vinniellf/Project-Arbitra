import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

type Props = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const [status, setStatus] = useState<"loading" | "auth" | "no-auth">("loading");

  useEffect(() => {
    const check = async () => {
      try {
        const session = await fetchAuthSession();

        if (session.tokens) {
          setStatus("auth");
        } else {
          setStatus("no-auth");
        }

      } catch {
        setStatus("no-auth");
      }
    };

    check();
  }, []);

  if (status === "loading") {
    return <div>Verificando sesión...</div>;
  }

  if (status === "no-auth") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
