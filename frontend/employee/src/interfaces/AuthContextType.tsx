export type User = {
    username: string;
    firstname: string;
    lastname: string;
    email?: string;
    role?: string;
    annual_leave_days?: number;
  };
  
export type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    initialCheckComplete: boolean;
    user: User | null;
    refreshUser:() => Promise<void>;
    login: (username: string, password: string) => void;
    logout: () => void;
  };
  