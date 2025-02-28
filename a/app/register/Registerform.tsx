"use client";

import React, { useState } from "react";
import axios from "axios";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitEnabled(false);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // **สมัครสมาชิก พร้อมกำหนด role เป็น 'user'**
      const response = await axios.post(
        "http://localhost:1337/api/auth/local/register",
        {
          username,
          email,
          password,
        }
      );

      console.log("Registration Success:", response.data);

      // **แสดงข้อความว่าสมัครสำเร็จ**
      setSuccessMessage("Registration successful! Please login.");

      // **เคลียร์ช่องกรอกข้อมูล**
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Registration failed. Please try again.");
    }

    setSubmitEnabled(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-black w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {successMessage && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-400 to-green-500 text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300 animate-fade-in">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4.586l5.293-5.293a1 1 0 10-1.414-1.414L9 11.586l-2.293-2.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg font-semibold">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-red-400 to-red-500 text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300 animate-fade-in">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-5a1 1 0 10-2 0v-4a1 1 0 012 0v4zm-1 6a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg font-semibold">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!submitEnabled}
          className={`w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition ${
            !submitEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
