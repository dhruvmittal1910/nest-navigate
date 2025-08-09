import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Auth";

interface UserProfileType {
    total_modules: number;
    completed_modules: number;
    overall_progress: number;
}

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfileType | null>(null)

    // fetch the profile everytime page reloads
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    // const profileData = await getUserProfile();
                    // setProfile(profileData)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchProfile()
    }, [])

    return (
        <div>
            <button onClick={() => { logout() }}>logout</button>
        </div>
    )
}