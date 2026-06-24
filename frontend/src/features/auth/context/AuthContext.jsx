import { createContext, useEffect, useMemo, useState } from "react";
import { loginRequest, logoutRequest } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoadingAuth(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);

    /*
      Este código espera que el backend devuelva:

      {
        token,
        usuarioId,
        nombres,
        apellidos,
        email,
        rol
      }
    */

    if (!data?.token || !data?.rol) {
      throw new Error(
        "El backend debe devolver token y rol para controlar los accesos."
      );
    }

    const loggedUser = {
      usuarioId: data.usuarioId,
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      rol: data.rol,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    setUser(loggedUser);

    return loggedUser;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Aunque el backend no responda, se elimina la sesión local.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loadingAuth,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}