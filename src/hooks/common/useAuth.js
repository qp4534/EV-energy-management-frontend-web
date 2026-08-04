import { useState, useEffect } from "react";

const AUTH_EVENT = "mijunge-auth-change";

function readAuth() {
  return {
    isLoggedIn: !!localStorage.getItem("token"),
    role: localStorage.getItem("role"), // "administrator" | "controller"
  };
}

export function setAuth({ token, role }) {
  localStorage.setItem("token", token);
  if (role) localStorage.setItem("role", role);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export default function useAuth() {
  const [auth, setAuthState] = useState(readAuth);

  useEffect(() => {
    const sync = () => setAuthState(readAuth());
    window.addEventListener(AUTH_EVENT, sync);
    return () => window.removeEventListener(AUTH_EVENT, sync);
  }, []);

  return auth;
}