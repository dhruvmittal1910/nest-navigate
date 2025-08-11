// calling the login and register apis

export const url = "https://nest-navigate-x1t5.onrender.com"

export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${url}/api/users/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        console.log(response, "login failed")
    }
    return response.json()
}

export const registerUser = async (username: string, email: string, password: string) => {
    const response = await fetch(`${url}/api/users/register`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, email, password })
    })

    if (!response.ok) {
        console.log(response, "registration failed")
    }
    return response.json()
}


export const create_module=async(title:string,lessons:string[],total_coins:number,description:string)=>{
    console.log(JSON.stringify({title,lessons,total_coins,description}))
    const response= await fetch(`${url}/api/create_modules`,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({title,lessons,total_coins,description})
    })

    if (!response.ok) {
        console.log(response, "cannot create a module")
    }
    return response.json()
}


export const getUserProfile = async () => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${url}/api/users/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return await response.json();
}

export const getProgressData = async (user_id: string) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${url}/api/progress/${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch module data");
    }

    return await response.json();
}

export const getModuleData = async () => {
    const response = await fetch(`${url}/api/modules`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (!response.ok) {
        throw new Error("Failed to fetch module data");
    }

    return await response.json();
}

export const completeLesson=async(module_id:string,lesson:string)=>{
    console.log("calling completeLesson route->",module_id,lesson)
    const token = localStorage.getItem("token")
    const response=await fetch(`${url}/api/progress/complete-lesson`,{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({
            module_id:module_id,
            lesson:lesson
        })
    })

    if (!response.ok) {
        throw new Error("Failed to fetch completed lesson data");
    }

    return await response.json();
}

export const updateProgress=async(user_id:string)=>{
    console.log("calling to update user progress route")
    const token=localStorage.getItem("token")
    const response=await fetch(`${url}/api/progress/${user_id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch completed lesson data");
    }

    return await response.json();
}


export const getUserActivity=async(user_id:string)=>{
    const token=localStorage.getItem("token")
    console.log(user_id,"->got from get user activity")

    const response=await fetch(`${url}/api/activity/${user_id}`,{
        method:"GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch user activity data");
    }

    return await response.json();
}