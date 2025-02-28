// app/login/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import axiosConfig from '../axios-interceptor';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitEnabled(false);

        try {
            // Step 1: Authenticate user
            let result = await axios.post('http://localhost:1337/api/auth/local', {
                identifier: username,
                password: password
            });
            axiosConfig.jwt = result.data.jwt; // Save JWT if needed

            // Step 2: Fetch user data including role
            result = await axios.get('http://localhost:1337/api/users/me?populate=role');
            console.log('User Data:', result.data); // Debugging output

            // Step 3: Check user role and redirect accordingly
            const userRole = result.data.role ? result.data.role.name.toLowerCase() : null; // Convert to lowercase

            if (userRole) {
                if (userRole === 'admin') {
                    router.push('/admin'); // Redirect to Admin page
                } else if (userRole === 'user') {
                    router.push('/user'); // Redirect to User page
                } else {
                    console.log('Unrecognized role:', userRole); // For other roles, if applicable
                }
            } else {
                console.log('Role not found in user data.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.log('Wrong username or password');
            setSubmitEnabled(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                        className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!submitEnabled}
                    className={`w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                        !submitEnabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    Submit
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;