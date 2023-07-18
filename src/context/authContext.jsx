import axios from "axios";
import { createContext, useEffect, useState } from "react";
axios.defaults.baseURL = "http://localhost:3000/api";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("/auth", inputs);
    setCurrentUser(res.data);
    window.location.href = "/write"
  };

  const logout = async (inputs) => {
    localStorage.removeItem("user");
    await axios.post("/auth/logout");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};