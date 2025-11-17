"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google"

export const user_service = "http://localhost:5000"
export const author_service = "http://localhost:5001"
export const blog_service = "http://localhost:5002"

export interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    bio: string;
}

interface AppContextType {
    user: User | null;
    isAuth: boolean;
    loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppContextProviderProps {
    children: ReactNode
}

export const AppProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    async function fetchUser() {
        try {
            setLoading(true)
            const token = Cookies.get("token")
            console.log(token)
            if (!token) {
                setLoading(false)
                return
            }
            console.log("api called")

            const { data } = await axios.get(`${user_service}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(data)
            setIsAuth(true)
            setLoading(false)

        } catch (error) {
            console.log(error)
            setIsAuth(false)
            setUser(null)
            setLoading(false)
        }
    }
    console.log("Context provider started")
    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <AppContext.Provider value={{ user, isAuth, loading }}>
            <GoogleOAuthProvider clientId="215032916124-ln6g73s0h6j084num4irgf3v5a1frnui.apps.googleusercontent.com">
                <Toaster />
                {children}
            </GoogleOAuthProvider>

        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error("useAppData must be used inside AppProvider")
    }

    return context
}
