import { UserCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { UserProfile } from "./UserProfile"
import { ModuleGrid } from "./ModuleGrid"
import React from "react"
import { Activity } from "./Activity"

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const handleProfileClick = () => {
        navigate("/profile")
    }



    const [progressUpdate, setProgressUpdate] = React.useState(false)

    const onProgressUpdate = () => {
        setProgressUpdate(prev => !prev)
    }

    return (
        <div>
            {/* need user profile + module grids + recent activity feed */}

            {/* navbar having heading and user profile icon */}

            <nav className="flex items-center justify-between p-4 shadow-md bg-white">
                <h1 className="text-2xl font-bold text-gray-800">Nest Navigate</h1>
                <button onClick={handleProfileClick} className="hover:text-blue-600">
                    <UserCircle className="w-8 h-8" />
                </button>
            </nav>

            {/* user profile */}
            <div className="p-10">
                <UserProfile refresh={progressUpdate} />
            </div>

            {/* recent acticity feed */}
            <div className="p-10">
                <Activity refresh={progressUpdate} />
            </div>

            {/* module grid */}
            <div className="p-10">
                <ModuleGrid onProgressUpdate={onProgressUpdate} />
            </div>

            

        </div>
    )
}

