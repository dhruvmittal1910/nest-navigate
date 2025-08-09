import React, { useEffect, useState } from "react"
import { useAuth } from "../context/Auth"
import { getModuleData, getProgressData, completeLesson, updateProgress } from "../api"
import { BookOpen, Award, Play, CheckCircle, Clock, Coins } from 'lucide-react';


interface Module {
    id: string;
    title: string;
    lessons: string[];
    total_coins: number;
    difficulty: string;
    description?: string;
}


interface Progress {
    user_id: string;
    module_id: string;
    lessons_completed: string[];
    completion_percentage: number;
    last_accessed: string;
}
interface ModuleGridProps {
    onProgressUpdate: () => void;
}
export const ModuleGrid: React.FC<ModuleGridProps> = ({onProgressUpdate}) => {
    // get the user
    const { user } = useAuth()

    const [modules, setModules] = useState<Module[]>([])
    const [progress, setProgress] = useState<Progress[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            // fetch the modules and user progress data here
            if (user) {
                try {
                    // make api calls here
                    const moduleData = await getModuleData()
                    console.log(moduleData)
                    setModules(moduleData)
                    // get progress data for the user
                    const progressData = await getProgressData(user["id"])
                    console.log(progressData)
                    setProgress(progressData)

                } catch (error) {
                    console.log(error, "error fetching data")
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchData();
    }, [user])

    const getModuleProgress = (module_id: string) => {
        return progress.find(p => p.module_id == module_id)
    }

    const startLesson = async (module_id: string, lesson: string) => {
        console.log(module_id,lesson," -> start lesson button clicked")
        if (!user) return;
        try {
            const result = await completeLesson(module_id, lesson)
            console.log(result,"completed_lesson")
            const updatedProgress = await updateProgress(user["id"])
            console.log(updatedProgress,"updated_progress")
            setProgress(updatedProgress)
            // updating the progress on whole module , change in lessons might happen

            onProgressUpdate(); //calling this to update the user profile like the modules.
 
        } catch (error) {
            console.log("error updating the lesson in modules", error)
        }
    }
    if (loading) return <p>Loading modules...</p>;

    return (
        <div>
            {/* Module Progress Grid
            ○ Display 3-4 learning modules (sample data is fine)
            ○ Show completion status for each module
            ○ Visual progress indicators */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Modules</h2>
                <p className="text-sm text-gray-600">
                    {progress.filter(p => p.completion_percentage === 100).length} of {modules.length} completed
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {modules.map(module => {
                    const moduleProgress = getModuleProgress(module.id);
                    console.log(moduleProgress)
                    const completedLessons = moduleProgress?.lessons_completed || [];
                    const completion = moduleProgress?.completion_percentage || 0;
                    const isCompleted = completion === 100
                    return (
                        <div key={module.id} className="border rounded-md p-4 bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} />
                                        <h3 className="font-semibold">{module.title}</h3>
                                        {isCompleted && <CheckCircle size={16} className="text-green-600" />}
                                    </div>
                                    <p className="text-sm text-gray-600">{module.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm mb-2">
                                <span className="flex items-center gap-1 text-yellow-700">
                                    <Coins size={14} />
                                    {module.total_coins}
                                </span>
                            </div>

                            <div className="mb-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span>{completion}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded">
                                    <div
                                        className="h-2 bg-blue-600 rounded"
                                        style={{ width: `${completion}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <h4 className="text-sm font-medium flex items-center gap-1">
                                    <Clock size={14} />
                                    Lessons ({completedLessons.length}/{module.lessons.length})
                                </h4>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {module.lessons.map((lesson, i) => {
                                        const done = completedLessons.includes(lesson);
                                        return (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center text-sm px-2 py-1 rounded hover:bg-gray-100"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {done ? (
                                                        <CheckCircle size={14} className="text-green-600" />
                                                    ) : (
                                                        <div className="w-3 h-3 border-2 border-gray-400 rounded-full" />
                                                    )}
                                                    <span className={done ? 'line-through text-gray-500' : 'text-gray-800'}>
                                                        {lesson}
                                                    </span>
                                                </div>
                                                {!done && (
                                                    <button
                                                        onClick={() => startLesson(module.id, lesson)}
                                                        title="Start Lesson"
                                                    >
                                                        <Play size={14} className="text-blue-600" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-2 border-t text-sm text-center">
                                {isCompleted ? (
                                    <div className="text-green-600 flex items-center justify-center gap-1">
                                        <Award size={16} />
                                        Module Completed!
                                    </div>
                                ) : (
                                    <p className="text-gray-600">
                                        {module.lessons.length - completedLessons.length} lessons remaining
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
