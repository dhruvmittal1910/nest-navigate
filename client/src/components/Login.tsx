import React, { useState } from 'react';
import { useAuth } from "../context/Auth"
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth()


    const navigate=useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('Form submitted');
        // simulate login/register logic

        // if islogin is true then do login flow else do register flow
        try {
            if (isLogin) {
                console.log("login flow")
                if (!formData.email.includes("@")) {
                    alert("Please enter a valid email address");
                    return;
                }
                await login(formData.email, formData.password)
                // redirect to dashboard page after successful login
            } else {
                console.log("register flow")
                await register(formData.username, formData.email, formData.password)
                // redirect to dashboard page after successful login
            }
            navigate("/dashboard")
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }

        setTimeout(() => setLoading(false), 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block mb-1 text-sm">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                                placeholder='Enter Username'
                            />
                        </div>
                    )}

                    <div>
                        <label className="block mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                            placeholder='Enter Email Address'
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                            placeholder='Enter Passwords'
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setFormData({ email: '', password: '', username: '' });
                            setError('');
                        }}
                        className="text-blue-600 underline"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};
