"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar";
import { useTracking } from "../hook/useTracking"; // ใช้ WebSocket เพื่อติดตามพัสดุ

export default function UserPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [trackingId, setTrackingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parcelData, setParcelData] = useState<any>(null);
    const [userParcels, setUserParcels] = useState<any[]>([]);

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

    // ฟังก์ชันดึงข้อมูลพัสดุของผู้ใช้
    const fetchUserParcels = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:1337/api/parcels/user/${userId}`, {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            console.log("User Parcels:", response.data); // Debug: ดูข้อมูลพัสดุของผู้ใช้
            setUserParcels(response.data);
        } catch (error) {
            console.error("Failed to fetch user parcels:", error);
            setError("Failed to fetch user parcels.");
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันดึงข้อมูลพัสดุจาก Strapi ตาม trackingId
    const fetchParcelData = async (trackingId: string) => {
        if (!trackingId) {
            setError("กรุณากรอกหมายเลขติดตาม");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:1337/api/parcels?trackingId=${trackingId}`, {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            console.log(`Fetching parcel data with trackingId: ${trackingId}`, response.data);
            if (response.data && response.data.length > 0) {
                setParcelData(response.data[0]);
            } else {
                setParcelData(null);
            }
        } catch (error) {
            console.error("Failed to fetch parcel data:", error);
            setError("Failed to fetch parcel data.");
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันกำหนดสถานะตาม checkpoint (เหมือนหน้า Admin)
    const getCheckpointStatus = (parcel: any) => {
        const car = parcel.cars && parcel.cars[0]; // ดึงข้อมูลรถจาก array cars
        if (!car) return "ไม่มีข้อมูลรถ";
        if (car.checkpoint1 && car.checkpoint2 && car.checkpoint3) {
            return "อยู่ที่คัดแยกสินค้าของจังหวัด";
        } else if (car.checkpoint1 && car.checkpoint2) {
            return "อยู่ครึ่งทาง";
        } else if (car.checkpoint1) {
            return "ออกจากขนส่ง";
        }
        return "ยังไม่ได้เริ่ม";
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch parcels of the user when userId changes
    useEffect(() => {
        if (userId) {
            fetchUserParcels();
        }
    }, [userId]);

    // ใช้ WebSocket หรือ API ถ้าหาก trackingId มีค่า
    useEffect(() => {
        if (trackingId) {
            if (!parcel) {
                fetchParcelData(trackingId); // ถ้าไม่มีข้อมูลจาก WebSocket ให้ดึงจาก API
            } else {
                setParcelData(parcel); // ถ้ามีข้อมูลจาก WebSocket ให้อัปเดต parcelData
            }
        }
    }, [trackingId, parcel]);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-semibold text-gray-800 mb-2">ข้อมูลการส่งพัสดุ</h1>
                    {loading && <p className="mt-4 text-gray-500">กำลังโหลด...</p>}
                </div>

                <div className="bg-white p-8 mt-6 rounded-lg shadow-xl">
                    <div className="space-y-6">
                        {/* ส่วนสำหรับ Tracking ID */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-700">Tracking ID:</h2>
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                placeholder="กรุณากรอกหมายเลขติดตาม"
                                className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* แสดงข้อมูลพัสดุจาก Tracking ID */}
                        {parcelData ? (
                            <div className="bg-gray-100 p-4 shadow-lg rounded-md">
                                <div className="space-y-4">
                                    <p className="text-lg">
                                        <strong>Status:</strong> {parcelData?.statusa ?? "ไม่ระบุ"}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Location:</strong> {getCheckpointStatus(parcelData)}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Timestamp:</strong> {parcelData?.timestamp ?? "ไม่ระบุ"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            !loading && trackingId && <p className="text-gray-500">ไม่พบข้อมูลพัสดุสำหรับ Tracking ID นี้</p>
                        )}

                        {/* แสดงข้อมูลพัสดุทั้งหมดของผู้ใช้ */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-700">พัสดุของคุณ</h2>
                            {userParcels.length > 0 ? (
                                <div className="mt-6 space-y-4">
                                    {userParcels.map((parcel) => (
                                        <div
                                            key={parcel.id}
                                            className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4"
                                        >
                                            <p>
                                                <strong className="text-gray-800">Tracking ID:</strong>{" "}
                                                {parcel.trackingId || "ไม่ระบุ"}
                                            </p>
                                            <p>
                                                <strong className="text-gray-800">Status:</strong>{" "}
                                                {parcel.statusa || "ไม่ระบุ"}
                                            </p>
                                            <p>
                                                <strong className="text-gray-800">Location:</strong>{" "}
                                                {getCheckpointStatus(parcel)}
                                            </p>
                                            <p>
                                                <strong className="text-gray-800">Timestamp:</strong>{" "}
                                                {parcel.timestamp || "ไม่มีข้อมูล"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !loading && <p className="text-gray-500">ไม่พบข้อมูลพัสดุของคุณ</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}