import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { apiClient } from "../../lib/api/client";
import { tokenStorage } from "../../lib/auth/token-storage";
import { AuthSession, User } from "../../types/domain";
import { authApi } from "../../features/auth/api";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (session: AuthSession) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenStorage.get());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    const response = await authApi.me();
    setUser(response.data);
  };

  const login = async (session: AuthSession) => {
    tokenStorage.set(session.accessToken);
    setToken(session.accessToken);
    setUser(session.user);
  };

  useEffect(() => {
    apiClient.onUnauthorized(logout);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        await refreshProfile();
      } catch {
        logout();
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      logout,
      refreshProfile
    }),
    [isBootstrapping, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
