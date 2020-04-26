import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";

import AsyncStorage from "@react-native-community/async-storage";

import api from "../services/api";

interface AuthState {
  user: object;
  token: string;
}

interface SignCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  loading: boolean;
  signIn(credentials: SignCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await api.post("/sessions", { email, password });

      const { user, token } = response.data;

      await AsyncStorage.multiSet([
        ["@GoBarber:user", JSON.stringify(user)],
        ["@GoBarber:token", token],
      ]);

      setData({ user, token });
    } catch (error) {
      console.log(error);

      throw new Error(error.response.data.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(["@GoBarber:user", "@GoBarber:token"]);

    setData({} as AuthState);
  }, []);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [user, token] = await AsyncStorage.multiGet([
        "@GoBarber:user",
        "@GoBarber:token",
      ]);

      if (user[1] && token[1]) {
        setData({ user: JSON.parse(user[1]), token: token[1] });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
