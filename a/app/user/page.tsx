"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar";
import { useTracking } from "../hook/useTracking";  // ควรใช้ hook นี้ในการดึงข้อมูลการติดตาม

export default function UserPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [trackingId, setTrackingId] = useState("");  // trackingId สำหรับใส่หมายเลขติดตาม
    const [parcel, setParcel] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้จาก API
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:1337/api/users/me", {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            setUserName(response.data.username);  // เก็บชื่อผู้ใช้จาก API
            setUserId(response.data.id);  // เก็บ userId จากข้อมูลผู้ใช้
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setError("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันเพื่อดึงข้อมูลพัสดุตาม userId และ trackingId
    const fetchParcelData = async () => {
        if (!userId || !trackingId) return; // ตรวจสอบว่า userId และ trackingId มีค่าหรือไม่ก่อนที่จะส่งคำขอ
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `http://localhost:1337/api/parcels?tracking_id=${trackingId}`,
                {
                    headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
                }
            );
            setParcel(response.data);  // เก็บข้อมูลพัสดุที่ได้รับจาก API
        } catch (error) {
            console.error("Failed to fetch parcel data:", error);
            setError("Failed to fetch parcel data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData(); // ดึงข้อมูลผู้ใช้เมื่อ component โหลด
    }, []);

    useEffect(() => {
        if (userId && trackingId) {
            fetchParcelData(); // ดึงข้อมูลพัสดุตาม userId และ trackingId เมื่อทั้งสองมีค่า
        }
    }, [userId, trackingId]);  // เมื่อ userId หรือ trackingId เปลี่ยน

    return (
        <div>
            <Navbar /> {/* เพิ่ม Navbar ที่นี่ */}
            <div className="text-center mt-8">
                <h1 className="text-2xl font-bold">สถานะการส่งของ</h1>
                {loading && <p>กำลังโหลด...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <p>Status: {parcel?.status ?? 'ไม่พบข้อมูล'}</p>
            </div>
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold">Tracking ID: {trackingId}</h1> {/* แสดง Tracking ID */}
                <div className="mt-4">
                    {parcel ? (
                        <div className="bg-white p-4 shadow-md rounded-md">
                            <p>Status: {parcel?.status ?? 'Loading...'}</p>
                            <p>Location: {parcel?.location?.lat ?? 'Loading...'}, {parcel?.location?.lon ?? 'Loading...'}</p>
                            <p>Timestamp: {parcel?.timestamp ?? 'Loading...'}</p>
                        </div>
                    ) : (
                        !loading && <p>ไม่พบพัสดุ</p>
                    )}
                </div>
            </div>
        </div>
    );
}
