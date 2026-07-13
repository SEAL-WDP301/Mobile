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
<<<<<<< HEAD
import { setUnauthorizedHandler } from "@/services/api/client";
=======
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6

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
<<<<<<< HEAD
    setUnauthorizedHandler(() => {
      setUser(null);
      setIsLoading(false);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    authApi
      .restoreSession()
      .then((restored) => {
        setUser(restored);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.signIn(email, password);
    setUser(data.user);
  }, []);

=======
    authApi.restoreSession().then((restored) => {
      setUser(restored);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.signIn(email, password);
    setUser(data.user);
  }, []);

>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
  const loginWithAccessToken = useCallback(async (accessToken: string) => {
    const profile = await authApi.completeOAuthLogin(accessToken);
    setUser(profile);
  }, []);

  const logout = useCallback(async () => {
    await authApi.signOut();
    const { disconnectChatSocket } = await import("@/services/chatSocket");
    disconnectChatSocket();
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
