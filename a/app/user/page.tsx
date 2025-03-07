"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar";
import { API_PATHS } from "../config/api";

export default function UserPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [trackingId, setTrackingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parcelData, setParcelData] = useState<any>(null);
    const [userParcels, setUserParcels] = useState<any[]>([]);

    // ฟังก์ชันดึงข้อมูลผู้ใช้
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_PATHS.USER_ME}`, {
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
        try {
            const response = await axios.get(`${API_PATHS.PARCELS}/user/${userId}`, {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            const newParcels = response.data;
            console.log("User Parcels:", newParcels);

            // Merge ข้อมูลใหม่กับข้อมูลเก่า
            setUserParcels((prevParcels) => {
                const merged = [...prevParcels];
                newParcels.forEach((newParcel: any) => {
                    const index = merged.findIndex((p) => p.id === newParcel.id);
                    if (index !== -1) {
                        merged[index] = newParcel; // อัปเดตข้อมูลที่มีอยู่
                    } else {
                        merged.push(newParcel); // เพิ่มข้อมูลใหม่
                    }
                });
                return merged;
            });
        } catch (error) {
            console.error("Failed to fetch user parcels:", error);
            setError("Failed to fetch user parcels.");
        }
    };

    // ฟังก์ชันดึงข้อมูลพัสดุตาม trackingId
    const fetchParcelData = async (trackingId: string) => {
        if (!trackingId) {
            setError("กรุณากรอกหมายเลขติดตาม");
            return;
        }
        try {
            const response = await axios.get(`${API_PATHS.PARCELS}?trackingId=${trackingId}`, {
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
        }
    };

    // ฟังก์ชันกำหนดสถานะตาม checkpoint
    const getCheckpointStatus = (parcel: any) => {
        const car = parcel.cars && parcel.cars[0];
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

    // โหลดข้อมูลเริ่มต้นและตั้ง polling
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserParcels();

            // Polling ทุก 5 วินาที
            const interval = setInterval(() => {
                fetchUserParcels();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [userId]);

    useEffect(() => {
        if (trackingId) {
            fetchParcelData(trackingId);

            // Polling ทุก 5 วินาทีสำหรับ trackingId
            const interval = setInterval(() => {
                fetchParcelData(trackingId);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [trackingId]);

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