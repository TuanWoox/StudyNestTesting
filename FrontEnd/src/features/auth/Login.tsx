import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login values:', { email, password });
        navigate('/user');
    };

    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
            <div className="flex flex-col items-center">
                <div className="text-3xl font-extrabold text-[#004c98] text-center mb-6">
                    Study Nest
                </div>

                <h2 className="text-xl font-semibold text-gray-700 text-center mb-2">
                    Sign in to your account
                </h2>

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-100 text-gray-900 border-gray-300 transition"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-100 text-gray-900 border-gray-300 transition"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition"
                    >
                        Login
                    </button>

                    {/* Links */}
                    <div className="flex justify-between text-md text-indigo-700">
                        <span
                            className="cursor-pointer hover:text-indigo-800 transition"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot Password?
                        </span>
                        <span
                            className="cursor-pointer hover:text-indigo-800 transition"
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </span>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Login;
