import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from "react"
import { loginUser, registerUser,getUserProfile } from "../api"

interface AuthContextType {
    user: any;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const Auth = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
    const context = useContext(Auth);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null)


    useEffect(()=>{
        const token=localStorage.getItem("token")
        if(token){
            const fetchData=async()=>{
                try{
                    const userProfile=await getUserProfile()
                    setUser(userProfile)
                }catch(error){
                    console.log("error fetching user data in auth.tsx")
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            fetchData()
        }   
    },[])

    const login = async (email: string, password: string) => {
        const data = await loginUser(email, password)
        console.log(data)
        // store the token in localStorage
        // token is at index 0 and user info at index 1
        localStorage.setItem("token", data[0])
        setUser(data[1])
    }

    const register = async (username:string,email: string, password: string) => {
        const data = await registerUser(username, email, password)
        // store the token in localstorage
        // token is at index 0 and user info at index 1
        localStorage.setItem("token", data[0])
        setUser(data[1])
    }

    const logout = () => {
        console.log("calling logout function")
        localStorage.removeItem("token")
        setUser(null)
    }


    const value: AuthContextType = {
        user, login, register, logout
    }

    return (
        <Auth.Provider value={value}>
            {children}
        </Auth.Provider>
    )
}
