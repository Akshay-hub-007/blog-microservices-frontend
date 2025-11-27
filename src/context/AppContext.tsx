"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google"

export const user_service = "https://blog-microservices-azure.vercel.app"
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
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logoutUser: () => Promise<void>
    blogs: Blog[] | null;
    blogLoading: Boolean;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    query: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    category: string;
    fetchBlogs: () => Promise<void>;
    savedBlogs: SavedBlogType[] | null;
    getSavedBlogs: () => Promise<void>
}
interface savedBlogs {
    id: string;
    userid: string;
    blogid: string;
    created_at: string;
}
const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppContextProviderProps {
    children: ReactNode
}

export interface Blog {
    id: string;
    title: string;
    description: string;
    blogcontent: string;
    image: string;
    category: string;
    author: string;
    created_at: string;
}

interface SavedBlogType {
    id: string;
    userid: string;
    blogid: string;
    create_at: string;
}
export const AppProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const [blogLoading, setBlogLoading] = useState(false)
    const [blogs, setBlogs] = useState<Blog[] | null>(null)
    const [query, setQuery] = useState("")
    const [category, setCategory] = useState("")
    const [savedBlogs, setSavedBlogs] = useState<SavedBlogType[] | null>(null)
    async function fetchBlogs() {
        try {
            setBlogLoading(true)
            const token = Cookies.get("token")

            const { data } = await axios.get(`${blog_service}/api/v1/blog/all?searchQuery=${query}&category=${category}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(data)
            setBlogs(data)

        } catch (error) {
            console.log(error)
        } finally {
            setBlogLoading(false)
        }
    }
    async function fetchUser() {
        try {
            setLoading(true)
            const token = Cookies.get("token")
            console.log(token)
            if (!token) {
                setLoading(false)
                return
            }
            console.log("object")
            const { data } = await axios.get(`${user_service}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(data)
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
    const logoutUser = async () => {
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false)
        toast.success("User logged out")
    };

    async function getSavedBlogs() {
        const token = Cookies.get("token")
        try {
            const { data } = await axios.get(`${blog_service}/api/v1/blog/saved/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setSavedBlogs(data)
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchUser()
        fetchBlogs()
        getSavedBlogs()
    }, [])

    useEffect(() => {
        console.log("fetching   ")
        fetchBlogs()
    }, [query, category])

    return (
        <AppContext.Provider value={{ user, isAuth, loading, setIsAuth, setLoading, setUser, logoutUser, blogs, blogLoading, setQuery, query, setCategory, category, fetchBlogs, savedBlogs,getSavedBlogs}}>
            <GoogleOAuthProvider clientId="215032916124-ln6g73s0h6j084num4irgf3v5a1frnui.apps.googleusercontent.com">
                <Toaster />
                {children}
            </GoogleOAuthProvider>
        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext)
    console.log(context)
    if (!context) {
        throw new Error("useAppData must be used inside AppProvider")
    }

    return context
}

