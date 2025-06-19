import { createContext, useContext, useState, useEffect } from "react";
import api from './api';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getData() {
      const userId = window.localStorage.getItem("userId");
      const token = window.localStorage.getItem("token");

      if (userId && token) {
        setUserId(JSON.stringify(userId));
        setToken(token);
      };
    };

    getData();
    // give that setUserId and setToken are already stable by themselves,
    // they are not needed as dependencies
  }, []);

  const login = async (postData) => {
    if (!postData || postData === null) {
      return {
        status: 404,
        message: "ValueError: Invalid PostData Values",
      };
    };

    try {
      const response = await api.post('/auth/login', postData);

      if (response.status === 200) {
        const { userId, token, message } = response.data;

        window.localStorage.setItem("userId", JSON.stringify(userId));
        window.localStorage.setItem("token", token);

        setUserId(userId);
        setToken(token);

        console.log(userId);

        return {
          status: response.status,
          message: message
        };
      }

      return {
        status: response.status,
        message: response.data.message || "Unknown response"
      };
    } catch (err) {
      console.error("Login error:", err);
      return {
        status: err.response?.status || 500,
        message: err.response?.data?.message || "An error occurred during login",
      };
    };
  };

  const logout = () => {
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("token");

    setUserId(null);
    setToken('');

    return {
      status: 201,
      message: "User Logged Out Successfully"
    };
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  };

  return context;
};
