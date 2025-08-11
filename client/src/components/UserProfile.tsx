import React, { useEffect, useState } from "react"
import { useAuth } from "../context/Auth";
import { getUserProfile } from "../api";
// import { Profile } from "./Profile";
import { useNavigate } from "react-router-dom";

interface UserProfileType {
    id: string;
    email: string;
    username: string;
    coins_earned: number;
    total_modules: number;
    completed_modules: number;
    overall_progress: number;
    created_at: string;
}

interface RefreshProp{
    refresh:boolean
}

export const UserProfile: React.FC<RefreshProp> = ({refresh}) => {

    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState<UserProfileType | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate=useNavigate()


    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    // then make a call to get user details
                    const userDetails = await getUserProfile()
                    setProfileData(userDetails)
                } catch (error) {
                    console.error(error, "error in fetching profile")
                } finally {
                    setLoading(false);
                }
            }
            if(!user && !loading)navigate("/")

        }

        fetchProfile();
    }, [user,refresh])


    if (loading) return <p>Loading...</p>;
    if (!profileData) return <p>No profile data available.</p>;


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    
    const handleLogout=()=>{
        logout();
        navigate("/");
    }

    return (
        <div>
            {/* User Profile Section
            ○ Display user name and total coins earned
            ○ Show overall learning progress (% completed across all modules) */}
            <div className="max-w-md mx-auto mt-10 p-4 border rounded bg-white shadow">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">{profileData.username}</h2>
                        <p className="text-sm text-gray-600">{profileData.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Logout
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-gray-700">Coins Earned:</p>
                        <p className="font-semibold">{profileData.coins_earned}</p>
                    </div>

                    <div>
                        <p className="text-gray-700">Progress:</p>
                        <p className="font-semibold">
                            {profileData.completed_modules} / {profileData.total_modules} modules
                        </p>
                        <div className="w-full bg-gray-200 rounded h-2 mt-1">
                            <div
                                className="bg-blue-500 h-2 rounded"
                                style={{ width: `${profileData.overall_progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{profileData.overall_progress}% complete</p>
                    </div>

                    <div>
                        <p className="text-gray-700">Member since:</p>
                        <p className="text-sm text-gray-600">{formatDate(profileData.created_at)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}