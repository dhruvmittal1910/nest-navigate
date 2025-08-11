import React, { useEffect, useState } from "react"
import { useAuth } from "../context/Auth"
import { getUserActivity } from "../api"
import { Clock, BookOpen, Coins, Award, TrendingUp } from "lucide-react";


interface ActivityType {
    id: string
    activity_type: string
    module_id: string
    lesson_name?: string
    coins_earned: number
}

interface ActivityProps {
    refresh: boolean
}

export const Activity: React.FC<ActivityProps> = ({ refresh }) => {

    const { user } = useAuth()
    const [activities, setActivities] = useState<ActivityType[]>([])

    useEffect(() => {

        // fetch the activity for each user

        const fetchActivity = async () => {
            if (user) {
                // call activity api
                try {
                    const result = await getUserActivity(user["id"])
                    setActivities(result)
                } catch (error) {
                    console.error("error fetching activities", error)
                }
            }
        }

        fetchActivity()

    }, [user, refresh])

    const getIcon = (type: string) => {
        if (type === "lesson_completed") return <BookOpen size={16} />;
        if (type === "coins_awarded") return <Coins size={16} />;
        if (type === "module_completed") return <Award size={16} />;
        return <TrendingUp size={16} />;
    };

    const getMessage = (a: any) => {
        if (a.activity_type === "lesson_completed") return `Completed "${a.lesson_name}"`;
        if (a.activity_type === "coins_awarded") return `Earned ${a.coins_earned} coins`;
        if (a.activity_type === "module_completed") return `Completed module`;
        return "Activity completed";
    };

    const timeAgo = (ts: string | Date) => {
        // Clean up timestamp if needed
        if (typeof ts === "string" && ts.includes(".")) {
            ts = ts.replace(/(\.\d{3})\d+/, "$1"); // keep only milliseconds
        }

        const past = new Date(ts);
        const now = new Date();
        const diffMs = now.getTime() - past.getTime();

        const seconds = Math.floor(diffMs / 1000);
        if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr${hours !== 1 ? "s" : ""} ago`;

        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

        const years = Math.floor(months / 12);
        return `${years} year${years !== 1 ? "s" : ""} ago`;
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Activity Feed</h2>
            </div>

            <h3 className="flex items-center gap-2 mb-4">
                <Clock size={16} /> Recent Activity
            </h3>

            {/* Recent Activity Feed
            ○ List recent completed lessons
            ○ Show coins earned from recent activities
            ○ Display timestamps */}

            {activities.length === 0 ? (
                <p>No activities yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((a: any, idx: number) => (
                        <div
                            key={idx}
                            className="bg-white shadow-sm rounded-lg p-4 border flex items-start gap-3 hover:shadow-md transition"
                        >
                            <div className="flex-shrink-0">{getIcon(a.activity_type)}</div>
                            <div>
                                <div className="font-medium">{getMessage(a)}</div>
                                <small className="text-gray-500">{timeAgo(a.timestamp)}</small>
                                {a.coins_earned > 0 && (
                                    <div className="text-yellow-600 font-medium mt-1 text-sm">
                                        +{a.coins_earned} coins
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}