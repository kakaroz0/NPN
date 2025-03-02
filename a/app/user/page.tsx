"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar"; 

export default function UserPage() {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:1337/api/users/me");
                setUserName(response.data.username);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <Navbar /> {/* เพิ่ม Navbar ที่นี่ */}
            <div className="text-center mt-8">
                <h1 className="text-2xl font-bold">สถานะการส่งของ</h1>
            </div>
        </div>
    );
}
