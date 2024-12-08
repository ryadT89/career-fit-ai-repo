'use client'

import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    id: "",
    userType: "",
  }); // To store user data

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:8000/auth/validate-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data[0].user;
    } catch (error) {
      console.error("Token validation failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (token) {
        const data = await validateToken(token);
        if (data) {
          setIsAuthenticated(true);
          setUser(data);
        } else {
          setIsAuthenticated(false);
          setUser({ id: "", userType: "" });
        }
      } else {
        setIsAuthenticated(false);
        setUser({ id: "", userType: "" });
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { isAuthenticated, user, loading };
};

export default useAuth;
