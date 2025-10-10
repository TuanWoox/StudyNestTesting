import { useContext, createContext } from "react";

export interface AuthContextValue {
    isAuthenticating: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
    isAuthenticating: false,
})

export const useAuthContext = () => useContext(AuthContext);