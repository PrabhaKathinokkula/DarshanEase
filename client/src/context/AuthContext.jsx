import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Added an absolute structural loader flag status to prevent racing route transitions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        const parsedUser = JSON.parse(storedUser);
        // Normalize role configuration property to lowercase
        if (parsedUser && parsedUser.role) {
          parsedUser.role = parsedUser.role.toLowerCase();
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      // Always kill loading state flag once sync from storage settles
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    if (userData && userData.role) {
      userData.role = userData.role.toLowerCase();
    }
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Blocks page evaluation frames entirely until context variable state extraction maps are ready */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);