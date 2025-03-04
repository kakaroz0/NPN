"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar";

export default function AdminPage() {
    const [parcels, setParcels] = useState<any[]>([]);
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllParcels = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:1337/api/parcels/all", {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            setParcels(response.data);
        } catch (error) {
            console.error("Failed to fetch parcels:", error);
            setError("Failed to fetch parcels.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserCount = async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/users", {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            setUserCount(response.data.length);
        } catch (error) {
            console.error("Failed to fetch user count:", error);
        }
    };

    useEffect(() => {
        fetchAllParcels();
        fetchUserCount();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                {loading && <p className="text-center">กำลังโหลด...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                <div className="grid grid-cols-2 gap-4 p-6">
                    <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
                        <h2 className="text-lg font-bold">จำนวนพัสดุทั้งหมด</h2>
                        <p className="text-2xl font-semibold">{parcels.length}</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                        <h2 className="text-lg font-bold">จำนวนผู้ใช้ทั้งหมด</h2>
                        <p className="text-2xl font-semibold">{userCount}</p>
                    </div>
                </div>
                
                {parcels.length > 0 ? (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">ข้อมูลพัสดุทั้งหมด</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">Tracking ID</th>
                                        <th className="py-2 px-4 border-b">สถานะ</th>
                                        <th className="py-2 px-4 border-b">ตำแหน่ง</th>
                                        <th className="py-2 px-4 border-b">เวลา</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parcels.map((parcel) => (
                                        <tr key={parcel.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{parcel.trackingId}</td>
                                            <td className="py-2 px-4 border-b">{parcel.statusa}</td>
                                            <td className="py-2 px-4 border-b">
                                                {parcel.location ? `${parcel.location.lat}, ${parcel.location.lon}` : "ไม่มีข้อมูล"}
                                            </td>
                                            <td className="py-2 px-4 border-b">{parcel.timestamp || "ไม่มีข้อมูล"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    !loading && <p className="text-center">ไม่พบข้อมูลพัสดุ</p>
                )}
            </div>
        </div>
    );
}
