import React, { ReactNode, createContext, useContext, useState } from "react";

interface AuthContextProps {
  verifiedAddress: string;
  setVerifiedAddress: React.Dispatch<React.SetStateAction<string>>;
}

// Create a context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>(""); // State to hold the shared token value

  return (
    <AuthContext.Provider value={{ verifiedAddress: token, setVerifiedAddress: setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
