
import React, { useState } from "react"
import { create_module } from "../api";
import { useNavigate } from "react-router-dom";
export const CreateModule: React.FC = () => {
    const navigate=useNavigate()
    const [moduleData, setModuleData] = useState({
        title: "",
        lessons: "",
        total_coins: 0,
        description: "",
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setModuleData({ ...moduleData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            title: moduleData.title,
            lessons: moduleData.lessons.split(",").map(lesson => lesson.trim()), // list of strings
            total_coins: Number(moduleData.total_coins),
            description: moduleData.description
        };
        console.log(data)
        try {
            await create_module(data.title, data.lessons, data.total_coins, data.description)
            navigate("/dashboard")
        } catch (error) {
            console.log("error in pushing form", error)
        }

    }

    return (
        <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-md w-full bg-white shadow-lg rounded-lg p-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Add New Module
                </h2>

                <input
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    name="lessons"
                    placeholder="Lessons (comma separated)"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    name="total_coins"
                    type="number"
                    placeholder="Total Coins"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />


                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"

                ></textarea>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors duration-300"
                >
                    Add Module
                </button>
            </form>
        </div>

    )
}