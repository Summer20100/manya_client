import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access-token") || Cookies.get("access_token");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(response => {
        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("access-token");
          Cookies.remove("access_token");
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        localStorage.removeItem("access-token");
        Cookies.remove("access_token");
        setIsAuthenticated(false);
      });
  }, []);

  return { isAuthenticated };
}
