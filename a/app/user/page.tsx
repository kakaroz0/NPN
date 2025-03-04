"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar";
import { useTracking } from "../hook/useTracking";  // ใช้ WebSocket เพื่อติดตามพัสดุ

export default function UserPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [trackingId, setTrackingId] = useState("");  // ค่า Tracking ID ที่จะใช้
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parcelData, setParcelData] = useState<any>(null);  // สำหรับเก็บข้อมูลสถานะพัสดุ

    // ใช้ Hook สำหรับติดตามสถานะพัสดุแบบ Real-time
    const parcel = useTracking(trackingId);

    // ฟังก์ชันดึงข้อมูลผู้ใช้
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:1337/api/users/me", {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            setUserName(response.data.username);
            setUserId(response.data.id);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setError("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันดึงข้อมูลพัสดุจาก Strapi
    const fetchParcelData = async (trackingId: string) => {
        if (!trackingId) {
            setError("กรุณากรอกหมายเลขติดตาม");
            return; // หยุดการทำงานหากไม่มียอดติดตาม
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:1337/api/parcels?trackingId=${trackingId}`, {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            console.log(`Fetching parcel data with trackingId: ${trackingId}`);

            if (response.data && response.data.length > 0) {
                setParcelData(response.data[0]);
            } else {
                setParcelData(null); // ไม่มีข้อมูลพัสดุ
            }
        } catch (error) {
            console.error("Failed to fetch parcel data:", error);
            setError("Failed to fetch parcel data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // ใช้ WebSocket ถ้าหาก trackingId มีค่า
    useEffect(() => {
        if (trackingId) {
            // ตรวจสอบก่อนว่า WebSocket ให้ข้อมูลมาไหม
            if (!parcel) {
                fetchParcelData(trackingId);  // ถ้าไม่มีข้อมูลจาก WebSocket ให้ดึงจาก API
            } else {
                setParcelData(parcel);  // ถ้ามีข้อมูลจาก WebSocket ให้อัปเดต parcelData
            }
        }
    }, [trackingId, parcel]);  // ตรวจสอบทั้ง trackingId และ parcel ที่ได้รับจาก WebSocket

    return (
        <div>
            <Navbar /> {/* Navbar */}
            <div className="text-center mt-8">
                <h1 className="text-2xl font-bold">สถานะการส่งของ</h1>
                {loading && <p>กำลังโหลด...</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold">Tracking ID: {trackingId}</h1>
                <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="กรอกหมายเลขติดตาม"
                    className="border rounded p-2 mt-2"
                />
                <div className="mt-4">
                    {parcelData ? (
                        <div className="bg-white p-4 shadow-md rounded-md">
                            <p>Status: {parcelData?.statusa ?? 'Loading...'}</p>
                            <p>Location: {parcelData?.location?.lat ?? 'Loading...'}, {parcelData?.location?.lon ?? 'Loading...'}</p>
                            <p>Timestamp: {parcelData?.timestamp ?? 'Loading...'}</p>
                        </div>
                    ) : (
                        !loading && <p>ไม่พบพัสดุ</p>
                    )}
                </div>
            </div>
        </div>
    );
}