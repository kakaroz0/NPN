"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import Navbar from "./navbar";

export default function AdminPage() {
    const [parcels, setParcels] = useState<any[]>([]);
    const [userCount, setUserCount] = useState(0);
    const [carCount, setCarCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTrackingId, setSearchTrackingId] = useState("");
    const [searchedParcel, setSearchedParcel] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ดึงข้อมูลพัสดุทั้งหมด
    const fetchAllParcels = async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/parcels/all", {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            const newParcels = response.data;
            console.log("Parcel Data Sample:", newParcels[0]);

            // Merge ข้อมูลใหม่กับข้อมูลเก่า โดยใช้ id เป็น key
            setParcels((prevParcels) => {
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
            console.error("Failed to fetch parcels:", error);
            setError("เกิดข้อผิดพลาดในการดึงข้อมูล parcels");
        }
    };

    // ดึงข้อมูลจำนวนผู้ใช้
    const fetchUserCount = async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/users", {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            setUserCount(response.data.length);
        } catch (error) {
            console.error("Failed to fetch user count:", error);
            setError("เกิดข้อผิดพลาดในการนับจำนวนผู้ใช้");
        }
    };

    // ดึงข้อมูลรถและนับจำนวนรถ
    const fetchCars = async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/cars", {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            setCarCount(response.data.length);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
            setError("เกิดข้อผิดพลาดในการดึงข้อมูลรถ");
        }
    };

    // ค้นหาพัสดุด้วย Tracking ID
    const searchParcel = async () => {
        if (!searchTrackingId) {
            setError("กรุณากรอกหมายเลขติดตาม");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:1337/api/parcels?trackingId=${searchTrackingId}`, {
                headers: { Authorization: `Bearer ${axiosConfig.jwt}` },
            });
            console.log("Search Result:", response.data);
            if (response.data && response.data.length > 0) {
                setSearchedParcel(response.data[0]);
                setError(null);
            } else {
                setSearchedParcel(null);
                setError("ไม่พบพัสดุ");
            }
        } catch (error) {
            console.error("Failed to search parcel:", error);
            setError("เกิดข้อผิดพลาดในการค้นหาพัสดุ");
        } finally {
            setLoading(false);
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
        fetchAllParcels();
        fetchUserCount();
        fetchCars();

        // Polling ทุก 5 วินาที
        const interval = setInterval(() => {
            fetchAllParcels();
        }, 5000);

        return () => clearInterval(interval); // ล้าง interval เมื่อ component unmount
    }, []);

    return (
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
                }`}
            >
                <div className="flex items-center justify-center mt-8">
                    <div className="flex items-center">
                        <svg className="w-12 h-12" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
                                fill="#4C51BF"
                                stroke="#4C51BF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
                                fill="white"
                            />
                        </svg>
                        <span className="mx-2 text-2xl font-semibold text-white">Dashboard</span>
                    </div>
                </div>
                <nav className="mt-10">
                    <a
                        className="flex items-center px-6 py-2 mt-4 text-gray-100 bg-gray-700 bg-opacity-25"
                        href="#"
                        onClick={() => fetchAllParcels()}
                    >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        <span className="mx-3">Dashboard</span>
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none lg:hidden">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container px-6 py-8 mx-auto">
                        <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>

                        {/* Cards */}
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="p-3 bg-indigo-600 rounded-full">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-2xl font-semibold text-gray-700">{userCount}</h4>
                                    <div className="text-gray-500">Total Users</div>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="p-3 bg-green-600 rounded-full">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-2xl font-semibold text-gray-700">{parcels.length}</h4>
                                    <div className="text-gray-500">Total Parcels</div>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="p-3 bg-blue-600 rounded-full">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-2xl font-semibold text-gray-700">{carCount}</h4>
                                    <div className="text-gray-500">Total Cars</div>
                                </div>
                            </div>
                        </div>

                        {/* Search Form */}
                        <div className="mt-6">
                            <input
                                type="text"
                                value={searchTrackingId}
                                onChange={(e) => setSearchTrackingId(e.target.value)}
                                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none"
                                placeholder="Search by tracking ID"
                            />
                            <button
                                onClick={searchParcel}
                                className="w-full mt-4 px-4 py-2 text-white bg-indigo-600 rounded-lg"
                                disabled={loading}
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                            {error && (
                                <div className="mt-4 text-red-500">
                                    <span>{error}</span>
                                </div>
                            )}
                            {searchedParcel && (
                                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                                    <div className="font-semibold">Parcel Details</div>
                                    <div>Tracking ID: {searchedParcel.trackingId || "ไม่ระบุ"}</div>
                                    <div>Status: {searchedParcel.statusa || "ไม่ระบุ"}</div>
                                    <div>Checkpoint: {getCheckpointStatus(searchedParcel)}</div>
                                </div>
                            )}
                        </div>

                        {/* ตารางข้อมูลพัสดุ */}
                        <div className="mt-8">
                            <div className="overflow-hidden bg-white rounded-lg shadow">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Tracking ID
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                สถานะ
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                ตำแหน่ง (Checkpoint)
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                เวลา
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {parcels.length > 0 ? (
                                            parcels.map((parcel) => (
                                                <tr key={parcel.id}>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {parcel.trackingId || "ไม่ระบุ"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {parcel.statusa || "ไม่ระบุ"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {getCheckpointStatus(parcel)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {parcel.timestamp || "ไม่มีข้อมูล"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center">
                                                    ไม่มีข้อมูลพัสดุ
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}