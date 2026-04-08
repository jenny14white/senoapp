import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  completeOnboarding: () => void;
  sendEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Load user from localStorage (mock auth persistence)
    const savedUser = localStorage.getItem("finapp-auth-user");

    if (savedUser) {
      const authUser = JSON.parse(savedUser);
      setUser(authUser);
      localStorage.setItem(
        "finapp-auth-user",
        JSON.stringify(authUser),
      );
      
      // Check onboarding status for this user
      const onboardingKey = `finapp-onboarded-${authUser.email}`;
      const savedOnboarding = localStorage.getItem(onboardingKey);
      setIsOnboarded(savedOnboarding === 'true');
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call Firebase Auth
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user exists in localStorage
    const savedUsers = localStorage.getItem("finapp-users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password,
    );

    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Nieprawidłowy email lub hasło");
    }

    const authUser: AuthUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      emailVerified: foundUser.emailVerified || false,
    };

    setUser(authUser);
    localStorage.setItem(
      "finapp-auth-user",
      JSON.stringify(authUser),
    );
    
    // Check onboarding status for this user
    const onboardingKey = `finapp-onboarded-${authUser.email}`;
    const savedOnboarding = localStorage.getItem(onboardingKey);
    setIsOnboarded(savedOnboarding === 'true');
    
    setIsLoading(false);
  };

  const register = async (email: string, password: string) => {
    // Mock registration - in real app, this would call Firebase Auth
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    const savedUsers = localStorage.getItem("finapp-users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    if (users.find((u: any) => u.email === email)) {
      setIsLoading(false);
      throw new Error(
        "Użytkownik z tym adresem email już istnieje",
      );
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, never store plain passwords!
      emailVerified: false,
    };

    users.push(newUser);
    localStorage.setItem("finapp-users", JSON.stringify(users));

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      emailVerified: false,
    };

    setUser(authUser);
    localStorage.setItem(
      "finapp-auth-user",
      JSON.stringify(authUser),
    );
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
    localStorage.removeItem("finapp-auth-user");
    localStorage.removeItem("finapp-onboarded");
  };

  const resetPassword = async (email: string) => {
    // Mock password reset - in real app, this would call Firebase Auth
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, send password reset email
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    // Mock password change - in real app, this would call Firebase Auth
    await new Promise((resolve) => setTimeout(resolve, 500));

    const savedUsers = localStorage.getItem("finapp-users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const userIndex = users.findIndex(
      (u: any) => u.id === user?.id,
    );

    if (userIndex !== -1) {
      if (users[userIndex].password !== currentPassword) {
        throw new Error("Nieprawidłowe obecne hasło");
      }
      users[userIndex].password = newPassword;
      localStorage.setItem(
        "finapp-users",
        JSON.stringify(users),
      );
    }
  };

  const completeOnboarding = () => {
    if (user) {
      setIsOnboarded(true);
      const onboardingKey = `finapp-onboarded-${user.email}`;
      localStorage.setItem(onboardingKey, 'true');
    }
  };

  const sendEmailVerification = async () => {
    // Mock email verification - in real app, this would call Firebase Auth
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (user) {
      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);
      localStorage.setItem(
        "finapp-auth-user",
        JSON.stringify(updatedUser),
      );

      // Update in users list
      const savedUsers = localStorage.getItem("finapp-users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const userIndex = users.findIndex(
        (u: any) => u.id === user.id,
      );
      if (userIndex !== -1) {
        users[userIndex].emailVerified = true;
        localStorage.setItem(
          "finapp-users",
          JSON.stringify(users),
        );
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        login,
        register,
        logout,
        resetPassword,
        changePassword,
        completeOnboarding,
        sendEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}