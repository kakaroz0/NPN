"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar";
import { useTracking } from "../hook/useTracking";  // ควรใช้ hook นี้ในการดึงข้อมูลการติดตาม

export default function UserPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [trackingId, setTrackingId] = useState("");  // trackingId สำหรับใส่หมายเลขติดตาม
    const parcel = useTracking(trackingId);  // ใช้ hook นี้ในการดึงข้อมูลจาก API

    useEffect(() => {
        // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้จาก API
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:1337/api/users/me", {
                    headers: { Authorization: `Bearer ${axiosConfig.jwt}` },  // ตรวจสอบ JWT ใน header
                });
                setUserName(response.data.username);  // เก็บชื่อผู้ใช้จาก API
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
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold">Parcel Tracking</h1>
                <input
                    type="text"
                    placeholder="Enter tracking ID"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}  // เมื่อเปลี่ยนค่าจาก input
                    className="border border-gray-300 p-2 rounded-md mt-4"
                />
                <div className="mt-4">
                    {parcel ? (
                        <div className="bg-white p-4 shadow-md rounded-md">
                            <p>Status: {parcel?.status ?? 'Loading...'}</p>
                            <p>Location: {parcel?.location?.lat ?? 'Loading...'}, {parcel?.location?.lon ?? 'Loading...'}</p>
                            <p>Timestamp: {parcel?.timestamp ?? 'Loading...'}</p>
                        </div>
                    ) : (
                        <p>No parcel found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
