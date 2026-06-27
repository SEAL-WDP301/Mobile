import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/types/api";
import * as authApi from "@/services/api/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithAccessToken: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi.restoreSession().then((restored) => {
      setUser(restored);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.signIn(email, password);
    setUser(data.user);
  }, []);

  const loginWithAccessToken = useCallback(async (accessToken: string) => {
    const profile = await authApi.completeOAuthLogin(accessToken);
    setUser(profile);
  }, []);

  const logout = useCallback(async () => {
    await authApi.signOut();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await authApi.restoreSession();
    setUser(profile);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithAccessToken,
      logout,
      refreshProfile,
    }),
    [user, isLoading, login, loginWithAccessToken, logout, refreshProfile],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
