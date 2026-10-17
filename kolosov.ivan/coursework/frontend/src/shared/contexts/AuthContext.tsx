import { createContext, useContext, useState } from "react"
import * as React from "react"

interface AuthContextType {
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    logIn: (clientId: number) => void
    logout: () => void
    getClientId: () => number
}


const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
            return localStorage.getItem("isLoggedIn") === "true"
        }
    )

    const logIn = (clientId: number) => {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("clientId", String(clientId))
        setIsLoggedIn(true)
    }

    const logout = () => {
        localStorage.setItem("isLoggedIn", "false")
        localStorage.setItem("clientId", String("undefined"))
        setIsLoggedIn(true)
        setIsLoggedIn(false)
    }

    const getClientId = () => { return Number(localStorage.getItem("clientId"))}

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logIn, logout, getClientId }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

